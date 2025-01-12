import React, { createContext, useContext, useState } from "react";

const themes = {
  light: {
    name: "Light",
    background: {
      from: "#FFFFFF",
      to: "#F8FAFC",
    },
    nav: "#FFFFFF",
    sidebar: {
      bg: "#F8FAFC",
      text: "#1E293B",
      activeItem: "#E2E8F0",
      hoverItem: "#F1F5F9",
      icon: "#64748B",
      divider: "#E2E8F0",
      logEntry: {
        bg: "#FFFFFF",
        userInput: "#EFF6FF",
        success: "#F0FDF4",
        error: "#FEF2F2",
        userText: "#2563EB",
        successText: "#16A34A",
        errorText: "#DC2626",
        timeText: "#64748B"
      },
      voiceCommands: {
        headerText: "#64748B",
        commandText: "#2563EB",
        descriptionText: "#475569",
        background: "#F8FAFC",
        border: "#E2E8F0"
      }
    },
    border: "#E2E8F0",
    editor: {
      bg: "#FFFFFF",
      text: "#1E293B",
      lineNumbers: {
        bg: "#F8FAFC",
        text: "#94A3B8",
      },
      header: {
        from: "#1E293B",
        to: "#334155",
      },
      gutter: "#F8FAFC",
    },
    output: {
      bg: "#FFFFFF",
      text: "#1E293B",
      header: {
        from: "#1E293B",
        to: "#334155",
      },
    },
    buttons: {
      primary: {
        bg: "#F1F5F9",
        hoverBg: "#E2E8F0",
        text: "#1E293B",
      },
      secondary: {
        bg: "#F1F5F9",
        hoverBg: "#E2E8F0",
        text: "#1E293B",
      },
      accent: {
        bg: "#F1F5F9",
        hoverBg: "#E2E8F0",
        text: "#1E293B",
      },
      run: {
        bg: "#2563EB",
        hoverBg: "#1D4ED8",
        text: "#FFFFFF",
      },
    },
    modal: {
      overlay: "rgba(0, 0, 0, 0.4)",
      background: "#FFFFFF",
      text: "#1E293B",
      border: "#E2E8F0",
      closeButton: "#64748B",
      fileCard: {
        background: "#F8FAFC",
        border: "#E2E8F0",
        text: "#475569",
      },
    },
  },
  dark: {
    name: "Dark",
    background: {
      from: "#0F172A",
      to: "#1E293B",
    },
    nav: "#1E293B",
    sidebar: {
      bg: "#1E293B",
      text: "#E2E8F0",
      activeItem: "#334155",
      hoverItem: "#2D3748",
      icon: "#94A3B8",
      divider: "#334155",
      logEntry: {
        bg: "#0F172A",
        userInput: "#1E3A8A",
        success: "#14532D",
        error: "#7F1D1D",
        userText: "#60A5FA",
        successText: "#4ADE80",
        errorText: "#FB7185",
        timeText: "#94A3B8"
      },
      voiceCommands: {
        headerText: "#94A3B8",
        commandText: "#60A5FA",
        descriptionText: "#CBD5E1",
        background: "#1E293B",
        border: "#334155"
      }
    },
    border: "#475569",
    editor: {
      bg: "#0F172A",
      text: "#E2E8F0",
      lineNumbers: {
        bg: "#1E293B",
        text: "#CBD5E1",
      },
      header: {
        from: "#1E293B",
        to: "#334155",
      },
      gutter: "#1E293B",
    },
    output: {
      bg: "#1E293B",
      text: "#F8FAFC",
      header: {
        from: "#1E293B",
        to: "#2D3748",
      },
    },
    buttons: {
      primary: {
        bg: "#2D3748",
        hoverBg: "#4A5568",
        text: "#F8FAFC",
      },
      secondary: {
        bg: "#2D3748",
        hoverBg: "#4A5568",
        text: "#F8FAFC",
      },
      accent: {
        bg: "#2D3748",
        hoverBg: "#4A5568",
        text: "#F8FAFC",
      },
      run: {
        bg: "#3182CE",
        hoverBg: "#2C5282",
        text: "#FFFFFF",
      },
    },
    modal: {
      overlay: "rgba(0, 0, 0, 0.75)",
      background: "#1E293B",
      text: "#F8FAFC",
      border: "#2D3748",
      closeButton: "#A0AEC0",
      fileCard: {
        background: "#0F172A",
        border: "#2D3748",
        text: "#E2E8F0",
      },
    },
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider
      value={{ theme, currentTheme, setCurrentTheme, themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
