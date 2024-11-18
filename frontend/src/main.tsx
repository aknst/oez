import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme-context.tsx";
import { AuthProvider } from "./context/auth-context.tsx";
import { Toaster } from "@/components/ui/sonner";

const Wrapper = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Wrapper />
  </StrictMode>
);
