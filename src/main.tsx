import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WalletProvider } from "./providers/WalletProvider.tsx";
import "@rainbow-me/rainbowkit/styles.css";
import { Provider } from "./components/ui/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider>
    <WalletProvider>
      <App />
    </WalletProvider>
  </Provider>
);
