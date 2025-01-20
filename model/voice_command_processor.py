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
    engine.say(text)
    engine.runAndWait()


def listen():
    debug_print("Starting voice recognition...")
    recognizer = sr.Recognizer()

    try:
        with sr.Microphone() as source:
            debug_print("Listening for commands...")
            audio = recognizer.listen(source)
            command = recognizer.recognize_google(audio).lower()
            debug_print(f"Recognized command: {command}")
            return command

    except sr.UnknownValueError:
        debug_print("Could not understand audio")
        return None
    except sr.RequestError as e:
        debug_print(f"Speech recognition error: {str(e)}")
        return None
    except Exception as e:
        debug_print(f"Unexpected error in listen(): {str(e)}")
        return None


class VoiceCommandMode:
    def __init__(self):
        self.coding_mode = False
        self.debug_print("Voice command mode initialized")

    def debug_print(self, message):
        sys.stderr.write(f"DEBUG: {message}\n")
        sys.stderr.flush()

    def is_coding_mode(self):
        return self.coding_mode

    def start_coding_mode(self):
        self.coding_mode = True
        self.debug_print("Coding mode activated")
        speak("Coding mode activated")
        print("MODE_CHANGE:START_CODING")
        sys.stdout.flush()

    def stop_coding_mode(self):
        self.coding_mode = False
        self.debug_print("Coding mode deactivated")
        speak("Coding mode deactivated")
        print("MODE_CHANGE:STOP_CODING")
        sys.stdout.flush()


command_mode = VoiceCommandMode()


def map_command_to_c_code(command):
    debug_print(f"Processing command: {command}")
    
    try:
        if command in action_mapping["actions"]:
            action = action_mapping["actions"][command]
            debug_print(f"Found action: {action}")
            
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
            debug_print("In coding mode, checking code commands...")
            for item in command_mapping["commands"]:
                try:
                    match = re.match(item["pattern"], command)
                    if match:
                        c_code = item["template"]
                        for i, group in enumerate(match.groups(), start=1):
                            c_code = c_code.replace(f"${i}", group)
                        print(f"Command matched:{c_code}")
                        sys.stdout.flush()
                        return c_code
                except Exception:
                    continue
            
            print("NO_MATCH:Command not recognized in coding mode")
            sys.stdout.flush()
        else:
            print("NO_MATCH:Please enter coding mode first")
            sys.stdout.flush()

        return None
    except Exception as e:
        debug_print(f"Error: {str(e)}")
        print(f"SYSTEM_MSG:Error processing command: {str(e)}")
        sys.stdout.flush()
        return None


def handle_nested_command():
    inner_code = []
    while True:
        speak("What would you like to add within this block? Say 'stop' to close.")
        command = listen()

        if command and "stop loop" in command.lower():
            speak("Closing current block.")
            break

        if command:
            c_code = map_command_to_c_code(command)
            if c_code:
                if "$INNER" in c_code:
                    speak("Starting a nested block.")
                    inner_nested_code = handle_nested_command()
                    c_code = c_code.replace("$INNER", "\n".join(inner_nested_code))
                inner_code.append(c_code)
            else:
                speak("Command not recognized.")
        else:
            speak("Could not understand the command, please try again.")

    return inner_code


def main():
    debug_print("Voice recognition system starting...")
    print("SYSTEM_MSG:Voice recognition started")
    sys.stdout.flush()

    while True:
        try:
            command = listen()
            if command:
                print(f"USER_SAID:{command}")
                sys.stdout.flush()

                code = map_command_to_c_code(command)
                if code is None:
                    debug_print("Command processed (mode switch)")
                    continue
        except Exception as e:
            debug_print(f"Error in main loop: {str(e)}")
            print(f"SYSTEM_MSG:Error in voice recognition: {str(e)}")
            sys.stdout.flush()
            continue


if __name__ == "__main__":
    main()
