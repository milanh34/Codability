import React, { useState, useEffect } from "react";
import {
  FolderIcon,
  FileIcon,
  ChevronDown,
  ChevronRight,
  Plus,
  RefreshCw,
  Mic,
  MicOff,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import FileNameModal from "./FileNameModal";
import "../styles/Sidebar.css";

const Sidebar = ({ setCode, setCurrentFileName, isFileModalOpen, setIsFileModalOpen }) => {
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [activeFile, setActiveFile] = useState(null);
  const [commandLogs, setCommandLogs] = useState([]);
  const [isLogOpen, setIsLogOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(false);

  const refreshFiles = async () => {
    if (window.electronAPI) {
      const files = await window.electronAPI.getGocoFiles();
      setFiles(files);
    }
  };

  useEffect(() => {
    refreshFiles();
  }, []);

  const handleFileClick = async (fileName) => {
    try {
      const content = await window.electronAPI.readFile(fileName);
      setCode(content);
      setCurrentFileName(fileName);
      setActiveFile(fileName);
      localStorage.setItem("lastOpenedFile", fileName);
    } catch (error) {
      console.error("Failed to read file:", error);
    }
  };

  return (
    <div
      className="sidebar"
      style={{
        backgroundColor: theme?.sidebar?.bg || "#f9f9f9",
        borderRight: `1px solid ${theme?.sidebar?.divider || "#cccccc"}`,
      }}
    >
      <div className="sidebar-header" style={{ color: theme?.sidebar?.text }}>
        <h2>File Explorer</h2>
        <div className="sidebar-actions">
          <button onClick={() => setIsFileModalOpen(true)} title="New File">
            <Plus size={18} />
          </button>
          <button onClick={refreshFiles} title="Refresh">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="file-list">
        {files.length === 0 ? (
          <p style={{ color: theme?.sidebar?.text }}>No files found</p>
        ) : (
          files.map((file) => (
            <div
              key={file}
              className={`file-item ${file === activeFile ? "active" : ""}`}
              style={{
                backgroundColor: file === activeFile ? theme?.sidebar?.activeBg : "transparent",
                color: theme?.sidebar?.text,
              }}
              onClick={() => handleFileClick(file)}
            >
              <FileIcon size={16} />
              <span>{file}</span>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer" style={{ color: theme?.sidebar?.text }}>
        {isListening ? (
          <div className="mic-status listening">
            <Mic size={16} />
            <span>Listening...</span>
          </div>
        ) : micError ? (
          <div className="mic-status error">
            <MicOff size={16} />
            <span>Mic Error</span>
          </div>
        ) : (
          <div className="mic-status idle">
            <Mic size={16} />
            <span>Mic Idle</span>
          </div>
        )}
      </div>

      {isFileModalOpen && (
        <FileNameModal
          setIsFileModalOpen={setIsFileModalOpen}
          refreshFiles={refreshFiles}
          setCode={setCode}
          setCurrentFileName={setCurrentFileName}
        />
      )}
    </div>
  );
};

export default Sidebar;
