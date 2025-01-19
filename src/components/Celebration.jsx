import React from "react";
import { StarIcon, SparklesIcon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/Celebration.css";

const Celebration = () => {
  const { theme } = useTheme();

  return (
    <div className="celebration-container">
      <div className="celebration-icons">
        <StarIcon
          className="celebration-icon"
          style={{ color: theme.buttons.accent.text, stroke: theme.buttons.accent.text }}
        />
        <SparklesIcon
          className="celebration-icon"
          style={{ color: theme.buttons.secondary.text, stroke: theme.buttons.secondary.text }}
        />
        <StarIcon
          className="celebration-icon"
          style={{ color: theme.buttons.primary.text, stroke: theme.buttons.primary.text }}
        />
      </div>
    </div>
  );
};

export default Celebration;
