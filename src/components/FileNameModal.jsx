import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { X, FileText, AlertCircle } from "lucide-react";
import "../styles/FileNameModal.css";

const FileNameModal = ({ 
  onClose, 
  onCreateFile, 
  existingFiles, 
  pendingFileName,
  selectedLanguage,
  isWaitingForLanguage 
}) => {
  const { theme } = useTheme();
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const languageExtensions = {
    java: ".java",
    python: ".py",
    cpp: ".cpp",
    c: ".c", // Add C extension
  };

  const fileTypes = [
    { ext: ".goco", label: "GOCO File (.goco)" },
    { ext: ".java", label: "Java File (.java)" },
    { ext: ".py", label: "Python File (.py)" },
    { ext: ".cpp", label: "C++ File (.cpp)" },
    { ext: ".c", label: "C File (.c)" },
  ];

  const validateFileName = (name) => {
    if (!name) return "File name is required";
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return "File name can only contain letters, numbers, underscores, and hyphens";
    }
    const fullFileName = `${name}${languageExtensions[selectedLanguage]}`;
    if (existingFiles.includes(fullFileName)) {
      return "A file with this name already exists";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const validationError = validateFileName(fileName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const fullFileName = fileName.includes(".") ? 
        fileName : 
        `${fileName}${languageExtensions[selectedLanguage]}`;
      await onCreateFile(fullFileName);
      onClose();
    } catch (err) {
      setError("Failed to create file. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (pendingFileName) {
      setFileName(pendingFileName);
      // Auto submit after a short delay
      const timer = setTimeout(() => {
        handleSubmit(new Event('submit'));
      }, 500);
      return () => clearTimeout(timer);
    }

    const submitHandler = (event) => {
      if (event.detail?.fileName) {
        setFileName(event.detail.fileName);
        // Auto submit after a short delay
        const timer = setTimeout(() => {
          handleSubmit(new Event('submit'));
        }, 500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("submitFileName", submitHandler);
    return () => window.removeEventListener("submitFileName", submitHandler);
  }, [pendingFileName]);

  useEffect(() => {
    if (pendingFileName) {
      // Clean up the filename before setting it
      const cleanFileName = pendingFileName.split("NO_MATCH")[0]
                                         .split("Command matched")[0]
                                         .trim();
      setFileName(cleanFileName);
    }
  }, [pendingFileName]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const activateNameInput = () => {
      const input = document.querySelector(".filename-input");
      if (input) {
        input.focus();
      }
    };

    const activateLanguageSelect = () => {
      const select = document.querySelector(".language-select");
      if (select) {
        select.focus();
      }
    };

    const handleSaveFileName = () => {
      if (fileName && !error) {
        handleSubmit(new Event('submit'));
      }
    };

    window.addEventListener("activateFileNameInput", activateNameInput);
    window.addEventListener("activateLanguageSelect", activateLanguageSelect);
    window.addEventListener("saveFileName", handleSaveFileName);

    return () => {
      window.removeEventListener("activateFileNameInput", activateNameInput);
      window.removeEventListener("activateLanguageSelect", activateLanguageSelect);
      window.removeEventListener("saveFileName", handleSaveFileName);
    };
  }, [fileName, error]);

  return (
    <div
      className="filename-modal-overlay"
      onClick={onClose}
      style={{
        backgroundColor: theme.modal.overlay,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="filename-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.modal.background,
          borderColor: theme.modal.border,
          color: theme.modal.text,
        }}
      >
        <button
          className="filename-modal-close"
          onClick={onClose}
          style={{ color: theme.modal.closeButton }}
        >
          <X size={20} />
        </button>

        <div
          className="filename-modal-icon"
          style={{ color: theme.modal.icon }}
        >
          <FileText size={48} />
        </div>

        <h2 className="filename-modal-title">Create New File</h2>

        <form onSubmit={handleSubmit} className="filename-modal-form">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                setError("");
              }}
              placeholder="Enter file name"
              className="filename-input"
              style={{
                borderColor: error ? theme.modal.error : theme.modal.border,
                backgroundColor: theme.modal.inputBackground,
              }}
              disabled={isSubmitting}
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
              style={{
                borderColor: theme.modal.border,
                backgroundColor: theme.modal.inputBackground,
                color: theme.modal.text,
              }}
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
          </div>

          {error && (
            <div className="error-message" style={{ color: theme.modal.error }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="create-button"
            disabled={isSubmitting}
            style={{
              backgroundColor: theme.buttons.primary.bg,
              color: theme.buttons.primary.text,
            }}
          >
            {isSubmitting ? "Creating..." : "Create File"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileNameModal;
