import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/OutputScreen.css";

const OutputScreen = ({ output, onUserInput }) => {
  const { theme } = useTheme();
  const [currentInput, setCurrentInput] = useState("");
  const inputRef = useRef(null);
  const [lines, setLines] = useState([]);
  const outputRef = useRef(null);

  useEffect(() => {
    if (output) {
      setLines([output]);
    }
  }, [output]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, currentInput]);

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    try {
      setLines((prev) => [...prev, `> ${currentInput}`]);
      const result = await onUserInput(currentInput);
      if (result) {
        setLines((prev) => [...prev, ...result.split("\n")]);
      }
      setCurrentInput("");
    } catch (error) {
      setLines((prev) => [...prev, `Error: ${error.message}`]);
    }
  };

  const renderContent = () => (
    <>
      {lines.map((line, index) => (
        <div
          key={index}
          className={`output-line ${line.startsWith(">") ? "user-input" : ""}`}
          style={{
            color: line.includes("OUTPUT:")
              ? "#00ff00"
              : line.includes("Error:")
              ? "#ff0000"
              : line.startsWith(">")
              ? "#888"
              : "inherit",
          }}
        >
          {line.startsWith(" OUTPUT:") ? line.replace(" OUTPUT:", "→") : line}
        </div>
      ))}
      {lines.length > 0 &&
        lines[lines.length - 1].includes("Enter value for") && (
          <form onSubmit={handleInputSubmit} className="input-form">
            <span className="input-prompt">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="terminal-input"
              style={{
                backgroundColor: "transparent",
                color: theme?.output?.text || "#000000",
                caretColor: theme?.output?.text || "#000000",
              }}
              autoFocus
            />
          </form>
        )}
    </>
  );

  return (
    <div
      className="output-container"
      style={{
        borderColor: theme?.border || "#cccccc",
        backgroundColor: theme?.output?.bg || "#ffffff",
      }}
    >
      <div
        className="output-header"
        style={{
          "--header-from": theme?.output?.header?.from || "#f5f5f5",
          "--header-to": theme?.output?.header?.to || "#e5e5e5",
        }}
      >
        <span className="output-header-text">🖥️ Terminal Output</span>
      </div>

      <div
        ref={outputRef}
        className="output-content"
        style={{
          color: theme?.output?.text || "#000000",
          backgroundColor: theme?.editor?.gutter || "#f0f0f0",
        }}
      >
        {lines.length > 0 ? (
          <div className="output-lines">{renderContent()}</div>
        ) : (
          <p>Ready to run your code! 🚀</p>
        )}
      </div>
    </div>
  );
};

export default OutputScreen;
