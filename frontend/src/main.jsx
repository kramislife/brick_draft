import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/styles/index.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import AuthProvider from "@/components/auth/AuthProvider";
import App from "@/App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>
);
