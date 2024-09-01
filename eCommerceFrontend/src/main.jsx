import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/security/AuthContext.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ModalProvider } from "./context/ModalContext.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthProvider>
    <ModalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ModalProvider>
  </AuthProvider>
  // </React.StrictMode>
);
