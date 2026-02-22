import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";

(function initTheme() {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Default to dark when no stored preference is available
    const theme = stored || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {
    console.error("Failed to initialize theme:", e);
  }
})();

createRoot(document.getElementById("root")).render(<App />);
