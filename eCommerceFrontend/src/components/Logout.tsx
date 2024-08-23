import React, { useEffect } from "react";
import { useAuth } from "./security/AuthContext";

const Logout:React.FC = () => {

    const authContext = useAuth();
    
    useEffect(()=> {
        authContext.logout();
    },[])   // empty array = this will work only once

    return(
        <div className="Logout">
            <h1>You are logged out!</h1>
            <h3>Thank you for using our app. Come back soon!</h3>
        </div>
    )
}

export default Logout;