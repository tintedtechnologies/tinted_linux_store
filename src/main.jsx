/**
 * @fileoverview Entry point for the React application.
 * Initializes the React DOM root and renders the main App component.
 * 
 * @author Tinted Linux Store Team
 * @version 0.1.0
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";

/**
 * Initialize and render the React application.
 * Creates a React root on the 'root' DOM element and renders the App component
 * wrapped in React.StrictMode for development checks.
 * 
 * @function
 * @name renderApp
 * 
 * @example
 * ```html
 * <!-- Requires a DOM element with id="root" -->
 * <div id="root"></div>
 * ```
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
