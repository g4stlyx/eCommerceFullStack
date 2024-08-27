import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "./security/AuthContext";
import React from "react";
import "../styles/login.css"

const Login: React.FC = () => {

    const [username, setUsername] = useState("g4stly");
    const [password, setPassword] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const navigate = useNavigate();

    const authContext = useAuth()

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    async function handleSubmit(){
        if(await authContext.login(username,password)){
            navigate(`/`);
        }
        else{
            setShowErrorMessage(true);
        }
    }

    return(
        <div className="Login">
            <br />
            <h1>Devam etmek için lütfen giriş yapınız.</h1>
            <br />
            {showErrorMessage && <div className="errorMessage">Giriş başarısız. Bilgilerinizi kontrol ediniz!</div>}
            <div className="loginForm">
                <div>
                    <label htmlFor="username">Kullanıcı Adı:</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    <label htmlFor="password">Şifre:</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div>
                    <button className="btn btn-primary mt-3" name="login" onClick={handleSubmit}>Giriş yap</button>
                </div>
                <br />
                <div>
                    Hesabınız yok mu? <a href="/sign-up">Kayıt ol.</a>
                </div>
                <div>
                <a href="/forgot-password" style={{fontSize:"15px"}}>Şifremi unuttum? </a>
                </div>
            </div>
            <br />
        </div>
    )

}

export default Login;