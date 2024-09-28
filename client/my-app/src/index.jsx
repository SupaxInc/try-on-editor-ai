import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import { PixiProvider } from "./pixi/contexts/PixiContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PixiProvider>
        <App />
      </PixiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
