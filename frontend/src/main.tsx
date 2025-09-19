import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import { SoundProvider } from "react-sounds";
import suspense from "/assets/suspense.mp3";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <Provider store={store}>
          <SoundProvider
            // Optional: preload both built-in and custom sounds
            preload={["ui/button_click", "notification/success", suspense]}
            // Optional: set initial sound enabled state (defaults to true)
            initialEnabled={true}
          >
            <App />
          </SoundProvider>
        </Provider>
      </CookiesProvider>
    </BrowserRouter>
  </StrictMode>
);
