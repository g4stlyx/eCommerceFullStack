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
            <h1>Please login to continue.</h1>
            <br />
            {showErrorMessage && <div className="errorMessage">Authentication Failed! Please check your credentials.</div>}
            <div className="loginForm">
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div>
                    <button className="btn btn-primary mt-3" name="login" onClick={handleSubmit}>Login</button>
                </div>
                <br />
                <div>
                    Dont't you have an account? <a href="/sign-up">Sign Up.</a>
                </div>
                <div>
                <a href="/forgot-password" style={{fontSize:"15px"}}>Forgot your password? </a>
                </div>
            </div>
            <br />
        </div>
    )

}

export default Login;