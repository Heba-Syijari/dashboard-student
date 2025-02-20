import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageContextProvider } from "./context/language.tsx";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LanguageContextProvider>
      <App />
    </LanguageContextProvider>
  </QueryClientProvider>
);
