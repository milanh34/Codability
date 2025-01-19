import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/CodeEditor";
import OutputScreen from "../components/OutputScreen";
import Celebration from "../components/Celebration";
import { useCodeEditor } from "../hooks/useCodeEditor";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/IDE.css";
import "regenerator-runtime/runtime";

const IDEContent = () => {
  const [isVerticalLayout, setIsVerticalLayout] = useState(true);
  const [output, setOutput] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentFileName, setCurrentFileName] = useState("main.goco");
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const { theme } = useTheme();

  const {
    code,
    setCode,
    lines,
    textareaRef,
    handleInputChange,
    handleKeyDown,
  } = useCodeEditor();

  const handleRun = useCallback(async () => {
    if (!window.electronAPI) {
      setOutput("Error: Electron API not available");
      return;
    }

    if (!code || !code.trim()) {
      setOutput("No code provided. Please add some code first.");
      return;
    }

    setOutput("");
    setTimeout(() => {
      setOutput("Compiling...");
    }, 100);

    try {
      const result = await window.electronAPI.compileCode(code, currentFileName);
      setOutput(result);
    } catch (error) {
      setOutput(`Compilation failed:\n${error.message}`);
    }
  }, [code, currentFileName]);

  const handleSave = async () => {
    if (!currentFileName) {
      console.error("No file selected to save.");
      return;
    }

    if (!window.electronAPI) {
      console.error("Electron API not available");
      return;
    }

    try {
      await window.electronAPI.writeFile(currentFileName, code);
      console.log("File saved successfully:", currentFileName);
    } catch (error) {
      console.error("Failed to save file:", error);
    }
  };

  const handleUserInput = async (input) => {
    if (!window.electronAPI) {
      throw new Error("Electron API not found!");
    }

    try {
      const result = await window.electronAPI.sendUserInput(input);
      return result;
    } catch (error) {
      console.error("Input error:", error);
      throw error;
    }
  };

  const handleDebug = () => {
    setIsDebugMode(true);
    console.log("Debug mode activated");
  };

  const handleBackToOutput = () => {
    setIsDebugMode(false);
    console.log("Back to output mode");
  };

  useEffect(() => {
    const runCodeHandler = () => handleRun();
    const toggleSidebarHandler = () => setIsSidebarVisible((prev) => !prev);
    const createFileHandler = () => window.dispatchEvent(new CustomEvent("openFileModal"));

    window.addEventListener("runCode", runCodeHandler);
    window.addEventListener("toggleSidebar", toggleSidebarHandler);
    window.addEventListener("createFile", createFileHandler);

    return () => {
      window.removeEventListener("runCode", runCodeHandler);
      window.removeEventListener("toggleSidebar", toggleSidebarHandler);
      window.removeEventListener("createFile", createFileHandler);
    };
  }, [handleRun]);

  return (
    <div
      className="ide-container"
      style={{
        background: `linear-gradient(to bottom, ${
          theme?.background?.from || "#ffffff"
        }, ${theme?.background?.to || "#f0f0f0"})`,
      }}
    >
      <Navbar
        isVerticalLayout={isVerticalLayout}
        setIsVerticalLayout={setIsVerticalLayout}
      />

      <div className="ide-content">
        {isSidebarVisible && (
          <Sidebar
            isVerticalLayout={true}
            setCode={setCode}
            setCurrentFileName={setCurrentFileName}
            isFileModalOpen={isFileModalOpen}
            setIsFileModalOpen={setIsFileModalOpen}
          />
        )}

        <div className="main-content">
          <div className="editor-output-container">
            <div
              className={`editor-output-flex ${
                isVerticalLayout ? "vertical" : "horizontal"
              }`}
            >
              <CodeEditor
                code={code}
                lines={lines}
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                handleRun={handleRun}
                handleSave={handleSave}
                textareaRef={textareaRef}
                currentFileName={currentFileName}
                handleDebug={handleDebug}
              />

              <OutputScreen output={output} onUserInput={handleUserInput} />
            </div>
          </div>
        </div>
      </div>

      {showCelebration && <Celebration />}
    </div>
  );
};

const IDE = () => {
  return (
    <ThemeProvider>
      <IDEContent />
    </ThemeProvider>
  );
};

export default IDE;
