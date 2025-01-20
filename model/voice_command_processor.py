import os
import subprocess
import speech_recognition as sr
import pyttsx3
import re
import json
import sys

engine = pyttsx3.init()


def debug_print(message):
    sys.stderr.write(f"DEBUG: {message}\n")
    sys.stderr.flush()


def load_mappings():
    try:
        actions_path = os.path.join(os.path.dirname(__file__), 'actions_mapping.json')
        commands_path = os.path.join(os.path.dirname(__file__), 'command_mapping.json')

        debug_print(f"Loading mappings from {actions_path} and {commands_path}")

        with open(actions_path, 'r') as f:
            actions = json.load(f)
        with open(commands_path, 'r') as f:
            commands = json.load(f)

        debug_print(f"Loaded {len(actions['actions'])} actions and {len(commands['commands'])} commands")
        return actions, commands
    except Exception as e:
        debug_print(f"Error loading mappings: {str(e)}")
        return {"actions": {}}, {"commands": []}


action_mapping, command_mapping = load_mappings()


def speak(text):
    debug_print(f"Speaking: {text}")
    engine.say(text)
    engine.runAndWait()


def listen():
    debug_print("Initializing recognizer")
    recognizer = sr.Recognizer()

    try:
        with sr.Microphone() as source:
            debug_print("Adjusting for ambient noise")
            recognizer.adjust_for_ambient_noise(source)
            debug_print("Listening for command...")
            audio = recognizer.listen(source)
            command = recognizer.recognize_google(audio).lower()
            debug_print(f"Recognized command: {command}")
            return command

    except sr.UnknownValueError:
        debug_print("Speech Recognition could not understand audio")
        return None
    except sr.RequestError as e:
        debug_print(f"Speech Recognition error: {str(e)}")
        return None
    except Exception as e:
        debug_print(f"Unexpected error: {str(e)}")
        return None


class VoiceCommandMode:
    def __init__(self):
        self.coding_mode = False
        debug_print("VoiceCommandMode initialized")

    def is_coding_mode(self):
        return self.coding_mode

    def start_coding_mode(self):
        self.coding_mode = True
        debug_print("Starting coding mode")
        speak("Coding mode activated")
        print("MODE_CHANGE:START_CODING")
        sys.stdout.flush()

    def stop_coding_mode(self):
        self.coding_mode = False
        debug_print("Stopping coding mode")
        speak("Coding mode deactivated")
        print("MODE_CHANGE:STOP_CODING")
        sys.stdout.flush()


command_mode = VoiceCommandMode()


def map_command_to_c_code(command):
    debug_print(f"Mapping command: {command}")

    try:
        if command in action_mapping["actions"]:
            action = action_mapping["actions"][command]
            debug_print(f"Action matched: {action}")

            if action == "START_CODE_MODE":
                command_mode.start_coding_mode()
                return None
            elif action == "STOP_CODE_MODE":
                command_mode.stop_coding_mode()
                return None

            print(f"Command matched:{action}")
            sys.stdout.flush()
            return action

        if command_mode.is_coding_mode():
            debug_print("In coding mode, trying code templates")
            for item in command_mapping["commands"]:
                try:
                    match = re.match(item["pattern"], command)
                    if match:
                        debug_print(f"Regex matched: {item['pattern']}")
                        c_code = item["template"]
                        for i, group in enumerate(match.groups(), start=1):
                            c_code = c_code.replace(f"${i}", group)
                        print(f"Command matched:{c_code}")
                        sys.stdout.flush()
                        return c_code
                except Exception as e:
                    debug_print(f"Error in pattern matching: {str(e)}")
                    continue

            print("NO_MATCH:Command not recognized in coding mode")
            sys.stdout.flush()
        else:
            print("NO_MATCH:Please enter coding mode first")
            sys.stdout.flush()

        return None
    except Exception as e:
        debug_print(f"Error in map_command_to_c_code: {str(e)}")
        print(f"SYSTEM_MSG:Error processing command: {str(e)}")
        sys.stdout.flush()
        return None


def handle_nested_command():
    debug_print("Handling nested command")
    inner_code = []

    while True:
        speak("What would you like to add within this block? Say 'stop' to close.")
        command = listen()

        if command and "stop loop" in command.lower():
            debug_print("Closing current nested block")
            speak("Closing current block.")
            break

        if command:
            c_code = map_command_to_c_code(command)
            if c_code:
                if "$INNER" in c_code:
                    debug_print("Found nested structure, recursing")
                    inner_nested_code = handle_nested_command()
                    c_code = c_code.replace("$INNER", "\n".join(inner_nested_code))
                inner_code.append(c_code)
            else:
                speak("Command not recognized.")
        else:
            speak("Could not understand the command, please try again.")

    return inner_code


def main():
    debug_print("Main function starting")
    print("SYSTEM_MSG:Voice recognition started")
    sys.stdout.flush()

    while True:
        try:
            command = listen()
            if command:
                debug_print(f"User said: {command}")
                print(f"USER_SAID:{command}")
                sys.stdout.flush()

                code = map_command_to_c_code(command)
                if code is None:
                    debug_print("No code generated, probably mode switch")
                    continue
        except Exception as e:
            debug_print(f"Error in main loop: {str(e)}")
            print(f"SYSTEM_MSG:Error in voice recognition: {str(e)}")
            sys.stdout.flush()
            continue


if __name__ == "__main__":
    main()
