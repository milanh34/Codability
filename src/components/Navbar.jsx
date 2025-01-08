import React from "react";
import { LayoutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/Navbar.css";

const Navbar = ({ isVerticalLayout, setIsVerticalLayout }) => {
  const { theme } = useTheme();

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: theme?.nav || "#ffffff",
        borderBottom: `2px solid ${theme?.border || "#cccccc"}`,
      }}
    >
      <div className="navbar-left">
        <span
          className="app-title"
          style={{ color: theme?.editor?.text || "#000000" }}
        >
          🎮 GoCode Studio
        </span>
      </div>
      <div className="navbar-right">
        <ThemeSelector />
        <button
          className="nav-button"
          style={{
            backgroundColor: theme?.buttons?.primary?.bg || "#ccccff",
            color: theme?.buttons?.primary?.text || "#000000",
          }}
          onClick={() => setIsVerticalLayout(!isVerticalLayout)}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              theme?.buttons?.primary?.hoverBg || "#9999ff")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              theme?.buttons?.primary?.bg || "#ccccff")
          }
        >
          <LayoutIcon className="icon" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
