/**
 * @fileoverview Vite configuration for Tauri + React development.
 * Configures development server, plugins, and Tauri-specific settings.
 * 
 * @author Tinted Linux Store Team
 * @version 1.0.0
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** @type {string|boolean} Host configuration from environment variable */
const host = process.env.TAURI_DEV_HOST;

/**
 * Vite configuration factory function.
 * Creates a configuration object optimized for Tauri development.
 * 
 * @async
 * @function
 * @returns {Promise<Object>} Vite configuration object
 * 
 * @see {@link https://vitejs.dev/config/} - Vite configuration documentation
 * @see {@link https://tauri.app/v1/guides/getting-started/setup/vite} - Tauri + Vite setup
 * 
 * @example
 * ```js
 * // This configuration enables:
 * // - React plugin for JSX support
 * // - Fixed port (1420) for Tauri compatibility
 * // - HMR with WebSocket protocol
 * // - File watching with src-tauri exclusion
 * ```
 */
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  /** @type {Array} Array of Vite plugins */
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  /** @type {boolean} Disable clearing screen to show Rust errors */
  clearScreen: false,
  
  // 2. tauri expects a fixed port, fail if that port is not available
  /** @type {Object} Development server configuration */
  server: {
    /** @type {number} Fixed port required by Tauri */
    port: 1420,
    /** @type {boolean} Fail if port is not available */
    strictPort: true,
    /** @type {string|boolean} Host binding configuration */
    host: host || false,
    /** @type {Object|boolean} Hot Module Replacement settings */
    hmr: host
      ? {
          /** @type {string} WebSocket protocol for HMR */
          protocol: "ws",
          /** @type {string} HMR host */
          host,
          /** @type {number} HMR WebSocket port */
          port: 1421,
        }
      : undefined,
    /** @type {Object} File watching configuration */
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      /** @type {Array<string>} Patterns to ignore during file watching */
      ignored: ["**/src-tauri/**"],
    },
  },
}));
