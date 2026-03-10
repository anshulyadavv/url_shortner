import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { handleRedirect } from "./lib/redirect";
import App from "./App.jsx";
import "./index.css";

handleRedirect().then((redirected) => {
  if (!redirected) {
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    );
  }
});