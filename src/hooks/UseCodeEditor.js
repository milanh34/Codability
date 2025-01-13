import { useState, useRef, useEffect } from "react";

export const useCodeEditor = () => {
  const [code, setCode] = useState("");
  const [lines, setLines] = useState(1);
  const [history, setHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    setLines(code.split("\n").length);
  }, [code]);

  const handleInputChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (newCode !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newCode);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(history[historyIndex + 1]);
    }
  };

  const getCurrentIndentation = (target) => {
    const lines = target.value.substring(0, target.selectionStart).split("\n");
    const currentLine = lines[lines.length - 1];
    return currentLine.match(/^\s*/)[0];
  };

  const insertText = (left, right, start, end, newCursorPos = null) => {
    const newCode = code.substring(0, start) + left + right + code.substring(end);
    setCode(newCode);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setTimeout(() => {
      const pos = newCursorPos !== null ? newCursorPos : start + left.length;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos;
    }, 0);
  };

  const handleKeyDown = (e) => {
    const { key, target } = e;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    if (e.ctrlKey && key === "z") {
      e.preventDefault();
      handleUndo();
      return;
    }

    if (e.ctrlKey && key === "y") {
      e.preventDefault();
      handleRedo();
      return;
    }

    const brackets = { "{": "}", "(": ")", "[": "]" };
    const closingBrackets = { "}": "{", ")": "(", "]": "[" };
    const quotes = { '"': '"', "'": "'" };

    if (brackets[key] || quotes[key]) {
      e.preventDefault();
      const nextChar = code.charAt(start);
      if (nextChar === quotes[key]) {
        setTimeout(() => {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
        }, 0);
      } else {
        insertText(key, brackets[key] || quotes[key], start, end);
      }
      return;
    } else if (closingBrackets[key]) {
      e.preventDefault();
      const prevChar = code.charAt(start - 1);
      if (prevChar === closingBrackets[key]) {
        setTimeout(() => {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
        }, 0);
      } else {
        insertText(key, "", start, end);
      }
    }

    if (key === "Enter") {
      const prevChar = code.charAt(start - 1);
      const nextChar = code.charAt(start);
      if (brackets[prevChar] === nextChar) {
        e.preventDefault();
        const currentIndentation = getCurrentIndentation(target);
        const insertedText = `\n${currentIndentation}    \n${currentIndentation}`;
        insertText(insertedText, "", start, end, start + currentIndentation.length + 5);
        return;
      }
      e.preventDefault();
      const indentation = getCurrentIndentation(target);
      insertText(`\n${indentation}`, "", start, end);
    }

    if (key === "Tab") {
      e.preventDefault();
      insertText("    ", "", start, end);
    }
  };

  return {
    code,
    setCode,
    lines,
    textareaRef,
    handleInputChange,
    handleKeyDown,
  };
};
