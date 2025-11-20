import { initAdminTabs } from "./adminTabs.js";
import { initAdminDashboard } from "./Dashboard.js";
import {
  createDevConsole,
  toggleDevConsole,
  logToDevConsole,
  clearDevConsole,
  activateJSONMode,
  activateWebSocketMode,
} from "./helpers/devConsole.js";

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Admin
  initAdminTabs();
  initAdminDashboard();

  // 🔹 Console dev
  createDevConsole();
  activateJSONMode();

  // Boutons console
  document
    .getElementById("json-mode")
    ?.addEventListener("click", activateJSONMode);
  document
    .getElementById("ws-mode")
    ?.addEventListener("click", activateWebSocketMode);
  document.getElementById("clear-logs")?.addEventListener("click", () => {
    clearDevConsole();
    logToDevConsole("🧹 Logs effacés", "info");
  });

  // Toggle clavier
  document.addEventListener("keydown", (e) => {
    if (e.key === "`") toggleDevConsole();
  });
});
