import React from "react";
import { SaveIcon, PlayIcon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/CodeEditor.css";

const CodeEditor = ({
  code,
  lines,
  handleInputChange,
  handleKeyDown,
  handleRun,
  handleSave,
  textareaRef,
  currentFileName,
}) => {
  const { theme } = useTheme();

  const onRunClick = () => {
    console.log("🏃‍♂️ Running code:", {
      fileName: currentFileName,
      codeLength: code.length,
      timestamp: new Date().toISOString(),
    });
    handleRun();
  };

  const handleEditorChange = (e) => {
    console.log("✏️ Editor content changed:", {
      cursorPosition: e.target.selectionStart,
      changeLength: e.target.value.length - code.length,
    });
    handleInputChange(e);
  };

  return (
    <div
      className="editor-container"
      style={{
        borderColor: theme?.border || "#cccccc",
        backgroundColor: theme?.editor?.bg || "#ffffff",
        "--border-color": theme?.border || "#cccccc",
      }}
    >
      <div
        className="editor-header"
        style={{
          "--header-from": theme?.editor?.header?.from || "#f5f5f5",
          "--header-to": theme?.editor?.header?.to || "#e5e5e5",
        }}
      >
        <div className="editor-file-info">
          <span className="editor-title">📝 {currentFileName}</span>
          <div className="editor-window-dots">
            <div className="red-dot" />
            <div className="yellow-dot" />
            <div className="green-dot" />
          </div>
        </div>
        <div className="editor-controls">
          <button className="editor-button" onClick={handleSave}>
            <SaveIcon className="editor-button-icon" />
          </button>
          <button
            className="run-button"
            onClick={onRunClick}
            style={{
              backgroundColor: theme?.buttons?.run?.bg || "#4CAF50",
              color: theme?.buttons?.run?.text || "#ffffff",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme?.buttons?.run?.hoverBg || "#45a049")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme?.buttons?.run?.bg || "#4CAF50")}
          >
            <PlayIcon className="run-icon" />
            <span>Run Code!</span>
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div
          className="line-numbers"
          style={{
            backgroundColor: theme?.editor?.lineNumbers?.bg || "#f0f0f0",
            color: theme?.editor?.lineNumbers?.text || "#666666",
          }}
        >
          {Array.from({ length: lines }, (_, i) => (
            <div key={i + 1} className="line-number">
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="editor-textarea"
          style={{
            backgroundColor: theme?.editor?.bg || "#ffffff",
            color: theme?.editor?.text || "#000000",
          }}
          value={code}
          onChange={handleEditorChange}
          onKeyDown={handleKeyDown}
          placeholder="Time to create something amazing! 🚀..."
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
