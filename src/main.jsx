import ReactDOM from "react-dom/client";
import React from 'react';
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { AttackerContextProvider } from "../attackerContext";
import { DefenderContextProvider } from "../defenderContext";
import { ModelContextProvider } from "../modelContext";
import { UserContextProvider } from "../userContext";
import "./index.css";
import './../components/FactionForm/factionForm.css'
import './../components/Models/modelForm.css'
import './../components/Fight/fight.css'
import './../components/Models/modelWargear.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <ModelContextProvider>
        <DefenderContextProvider>
          <AttackerContextProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </AttackerContextProvider>
        </DefenderContextProvider>
      </ModelContextProvider>
    </UserContextProvider>
  </StrictMode>
);
