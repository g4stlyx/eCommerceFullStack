import React, { useEffect } from "react";
import { useAuth } from "./security/AuthContext";

const Logout:React.FC = () => {

    const authContext = useAuth();
    
    useEffect(()=> {
        authContext.logout();
    },[])   // empty array = this will work only once

    return(
        <div className="Logout">
            <br />
            <h1>Başarıyla çıkış yapıldı!</h1>
            <h3>Uygulamamızı kullandığınız için teşekkürler. Tekrar giriş yapmak için <a href="/login">tıklayınız.</a></h3>
        </div>
    )
}

export default Logout;