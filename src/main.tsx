import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter"; // Import AppRouter
import "./index.css"; // Global styles (optional)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
