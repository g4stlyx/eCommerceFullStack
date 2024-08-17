import App from "./App.tsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/security/AuthContext.tsx";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  // </React.StrictMode>
);
