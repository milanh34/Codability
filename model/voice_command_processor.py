import os
import subprocess
import speech_recognition as sr
import pyttsx3
import re
import json
import sys

class VoiceAssistant:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.action_mapping, self.command_mapping = self.load_mappings()
        self.command_mode = self.VoiceCommandMode()
        self.debug_print("VoiceAssistant initialized")

    def debug_print(self, message):
        sys.stderr.write(f"DEBUG: {message}\n")
        sys.stderr.flush()

    def load_json(self, file_name):
        try:
            path = os.path.join(os.path.dirname(__file__), file_name)
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            self.debug_print(f"Error loading {file_name}: {str(e)}")
            return None

    def load_mappings(self):
        actions = self.load_json('actions_mapping.json') or {"actions": {}}
        commands = self.load_json('command_mapping.json') or {"commands": []}
        self.debug_print(f"Mappings loaded: {len(actions['actions'])} actions, {len(commands['commands'])} commands")
        return actions, commands

    def speak(self, text):
        self.debug_print(f"Speaking: {text}")
        self.engine.say(text)
        self.engine.runAndWait()

    def listen(self):
        self.debug_print("Listening started")
        recognizer = sr.Recognizer()
        try:
            with sr.Microphone() as source:
                recognizer.adjust_for_ambient_noise(source)
                self.debug_print("Ambient noise adjusted")
                audio = recognizer.listen(source)
                command = recognizer.recognize_google(audio).lower()
                self.debug_print(f"Recognized: {command}")
                return command
        except (sr.UnknownValueError, sr.RequestError) as e:
            self.debug_print(f"Recognizer error: {str(e)}")
            return None
        except Exception as e:
            self.debug_print(f"Listen error: {str(e)}")
            return None

    class VoiceCommandMode:
        def __init__(self):
            self.coding_mode = False

        def is_coding_mode(self):
            return self.coding_mode

        def start_coding_mode(self):
            self.coding_mode = True
            print("MODE_CHANGE:START_CODING")
            sys.stdout.flush()

        def stop_coding_mode(self):
            self.coding_mode = False
            print("MODE_CHANGE:STOP_CODING")
            sys.stdout.flush()

    def process_action(self, action):
        if action == "START_CODE_MODE":
            self.command_mode.start_coding_mode()
            self.speak("Coding mode activated")
            return None
        elif action == "STOP_CODE_MODE":
            self.command_mode.stop_coding_mode()
            self.speak("Coding mode deactivated")
            return None
        else:
            print(f"Command matched:{action}")
            sys.stdout.flush()
            return action

    def map_command_to_c_code(self, command):
        self.debug_print(f"Mapping command: {command}")
        try:
            if command in self.action_mapping["actions"]:
                action = self.action_mapping["actions"][command]
                self.debug_print(f"Found action mapping: {action}")
                return self.process_action(action)

            if self.command_mode.is_coding_mode():
                self.debug_print("Checking coding templates")
                for item in self.command_mapping["commands"]:
                    try:
                        match = re.match(item["pattern"], command)
                        if match:
                            self.debug_print(f"Matched pattern: {item['pattern']}")
                            c_code = item["template"]
                            for i, group in enumerate(match.groups(), start=1):
                                c_code = c_code.replace(f"${i}", group)
                            print(f"Command matched:{c_code}")
                            sys.stdout.flush()
                            return c_code
                    except Exception as e:
                        self.debug_print(f"Regex error: {str(e)}")
                        continue

                print("NO_MATCH:Command not recognized in coding mode")
                sys.stdout.flush()
            else:
                print("NO_MATCH:Please enter coding mode first")
                sys.stdout.flush()

            return None
        except Exception as e:
            self.debug_print(f"Mapping error: {str(e)}")
            print(f"SYSTEM_MSG:Error processing command: {str(e)}")
            sys.stdout.flush()
            return None

    def handle_nested_command(self):
        self.debug_print("Handling nested command")
        inner_code = []

        while True:
            self.speak("What would you like to add within this block? Say 'stop' to close.")
            command = self.listen()

            if command and "stop loop" in command.lower():
                self.debug_print("Closing current nested block")
                self.speak("Closing current block.")
                break

            if command:
                c_code = self.map_command_to_c_code(command)
                if c_code:
                    if "$INNER" in c_code:
                        self.debug_print("Nested block found")
                        inner_nested_code = self.handle_nested_command()
                        c_code = c_code.replace("$INNER", "\n".join(inner_nested_code))
                    inner_code.append(c_code)
                else:
                    self.speak("Command not recognized.")
            else:
                self.speak("Could not understand the command, please try again.")

        return inner_code

    def run(self):
        self.debug_print("Voice assistant started")
        print("SYSTEM_MSG:Voice recognition started")
        sys.stdout.flush()

        while True:
            try:
                command = self.listen()
                if command:
                    self.debug_print(f"User said: {command}")
                    print(f"USER_SAID:{command}")
                    sys.stdout.flush()

                    code = self.map_command_to_c_code(command)
                    if code is None:
                        self.debug_print("No code generated or mode switched")
                        continue
            except Exception as e:
                self.debug_print(f"Main loop error: {str(e)}")
                print(f"SYSTEM_MSG:Error in voice recognition: {str(e)}")
                sys.stdout.flush()
                continue

if __name__ == "__main__":
    assistant = VoiceAssistant()
    assistant.run()
