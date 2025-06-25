import ReactDOM from "react-dom/client";
import React from 'react';
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { AttackerContextProvider } from "../attackerContext";
import { DefenderContextProvider } from "../defenderContext";
import { ModelContextProvider } from "../modelContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ModelContextProvider>
      <DefenderContextProvider>
        <AttackerContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AttackerContextProvider>
      </DefenderContextProvider>
    </ModelContextProvider>
  </StrictMode>
);
