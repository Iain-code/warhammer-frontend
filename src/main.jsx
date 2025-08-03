import ReactDOM from "react-dom/client";
import React from 'react';
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AttackerContextProvider } from "../contexts/attackerContext";
import { DefenderContextProvider } from "../contexts/defenderContext";
import { ModelContextProvider } from "../contexts/modelContext";
import { UserContextProvider } from "../contexts/userContext";
import { RosterContextProvider } from "../contexts/rosterContext";
import './../components/FactionForm/factionForm.css'
import './../components/Models/modelForm.css'
import './../components/Fight/fight.css'
import './../components/Models/modelWargear.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <RosterContextProvider>
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
  </RosterContextProvider>
);
