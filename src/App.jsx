import React from "react";
import { Routes, Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import IDE from "./pages/IDE";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<IDE />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
