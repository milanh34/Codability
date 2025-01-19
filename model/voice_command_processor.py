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
        base_path = os.path.dirname(__file__)
        with open(os.path.join(base_path, 'actions_mapping.json')) as f:
            actions = json.load(f)
        with open(os.path.join(base_path, 'command_mapping.json')) as f:
            commands = json.load(f)
        debug_print(f"Loaded {len(actions['actions'])} actions and {len(commands['commands'])} commands")
        return actions, commands
    except Exception as e:
        debug_print(f"Error loading mappings: {e}")
        return {"actions": {}}, {"commands": []}

action_mapping, command_mapping = load_mappings()

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen():
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            debug_print("Listening...")
            audio = recognizer.listen(source)
            command = recognizer.recognize_google(audio).lower()
            debug_print(f"Recognized: {command}")
            return command
    except (sr.UnknownValueError, sr.RequestError) as e:
        debug_print(f"Recognition error: {e}")
        return None
    except Exception as e:
        debug_print(f"Unexpected error: {e}")
        return None

class VoiceCommandMode:
    def __init__(self):
        self.coding_mode = False
        debug_print("Initialized voice command mode")

    def start(self):
        self.coding_mode = True
        debug_print("Coding mode ON")
        speak("Coding mode activated")
        print("MODE_CHANGE:START_CODING")
        sys.stdout.flush()

    def stop(self):
        self.coding_mode = False
        debug_print("Coding mode OFF")
        speak("Coding mode deactivated")
        print("MODE_CHANGE:STOP_CODING")
        sys.stdout.flush()

command_mode = VoiceCommandMode()

def map_command_to_c_code(command):
    debug_print(f"Processing: {command}")
    try:
        if command in action_mapping["actions"]:
            action = action_mapping["actions"][command]
            if action == "START_CODE_MODE":
                command_mode.start()
            elif action == "STOP_CODE_MODE":
                command_mode.stop()
            else:
                print(f"Command matched:{action}")
                sys.stdout.flush()
            return None

        if command_mode.coding_mode:
            for item in command_mapping["commands"]:
                match = re.match(item["pattern"], command)
                if match:
                    c_code = item["template"]
                    for i, group in enumerate(match.groups(), start=1):
                        c_code = c_code.replace(f"${i}", group)
                    print(f"Command matched:{c_code}")
                    sys.stdout.flush()
                    return c_code
            print("NO_MATCH:Command not recognized in coding mode")
            sys.stdout.flush()
        else:
            print("NO_MATCH:Please enter coding mode first")
            sys.stdout.flush()

    except Exception as e:
        debug_print(f"Error mapping command: {e}")
        print(f"SYSTEM_MSG:Error processing command: {e}")
        sys.stdout.flush()
    return None

def run_c_file(file_name):
    compiled_name = "compiled_program"
    compile_process = subprocess.run(["gcc", file_name, "-o", compiled_name], capture_output=True, text=True)
    if compile_process.returncode == 0:
        speak(f"Running {file_name}")
        subprocess.run([f"./{compiled_name}"])
    else:
        speak("Error compiling file.")
        print(compile_process.stderr)

def handle_command(command):
    if "run" in command:
        file_name = command.replace("run ", "") + ".c"
        run_c_file(file_name)
    else:
        speak("Command not recognized.")

def main():
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
                    continue
        except Exception as e:
            debug_print(f"Main loop error: {e}")
            print(f"SYSTEM_MSG:Error in voice recognition: {e}")
            sys.stdout.flush()

if __name__ == "__main__":
    main()
