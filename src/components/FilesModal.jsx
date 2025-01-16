import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { X, ChevronRight, FileCode, Sparkles } from "lucide-react";
import "../styles/FilesModal.css";

const FilesModal = ({ onClose, children, title, onFileSelect }) => {
  const { theme, currentTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);

  const getThemeAccentColor = () => {
    const themeColors = {
      light: "#3B82F6",
      dark: "#60A5FA",
      neon: "#FF00FF",
      cyberpunk: "#FF2A6D",
      synthwave: "#E94560",
      monokai: "#A6E22E",
      nordTheme: "#88C0D0",
      sunshine: "#FFD700",
      bubblegum: "#FF69B4",
      aqua: "#00CED1",
      lavender: "#9370DB",
    };
    return themeColors[currentTheme] || themeColors.light;
  };

  const getThemeStyles = () => ({
    "--theme-accent": theme.buttons.primary.bg,
    "--theme-accent-text": theme.buttons.primary.text,
    "--theme-accent-bg": `${theme.buttons.primary.bg}15`,
  });

  const handleFileClick = async (file) => {
    setSelectedFile(file);
    setTimeout(() => onFileSelect(file), 500);
  };

  useEffect(() => {
    const showModal = () => {
      // Highlight the first file by default
      const firstFile = document.querySelector(".file-card");
      if (firstFile) {
        firstFile.focus();
      }
    };

    window.addEventListener("showFilesModal", showModal);
    return () => window.removeEventListener("showFilesModal", showModal);
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        backgroundColor: theme.modal.overlay,
        "--theme-gradient-start": `${getThemeAccentColor()}33`,
        "--theme-gradient-end": "transparent",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.modal.background,
          color: theme.modal.text,
          borderColor: theme.modal.border,
        }}
      >
        <div
          className="modal-header"
          style={{ borderBottomColor: theme.modal.border }}
        >
          <h2 className="modal-title">
            <Sparkles
              size={20}
              style={{
                marginRight: "8px",
                animation: "sparkle 1.5s ease-in-out infinite",
              }}
            />
            {title}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            style={{ color: theme.modal.closeButton }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="file-grid">
            {Array.isArray(children) &&
              children.map((file, index) => {
                const fileName = file.replace(".goco", "");

                return (
                  <div
                    key={file}
                    className={`file-card ${
                      selectedFile === file ? "selected" : ""
                    }`}
                    onClick={() => handleFileClick(file)}
                    style={{
                      ...getThemeStyles(),
                      "--file-index": index,
                    }}
                  >
                    <div className="file-info">
                      <div className="file-icon-wrapper">
                        <FileCode size={16} />
                      </div>
                      <div className="file-name-section">
                        <span className="file-name">{fileName}</span>
                        <span className="file-extension">.goco</span>
                      </div>
                      <div className="file-action">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesModal;
