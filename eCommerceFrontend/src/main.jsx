import App from "./App.tsx";
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/security/AuthContext.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

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
