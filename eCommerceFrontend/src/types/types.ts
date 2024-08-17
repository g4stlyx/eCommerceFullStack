import { ReactNode } from 'react';

export interface DecodedToken {
    exp: number;
    sub: string;
    isAdmin: boolean;
}

export interface AuthenticationRouteProps {
    children: ReactNode;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    storedToken: string | null;
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ErrorProps{
    message: string;
    status: number;
}

export interface SignUpFormValues{
    username: string;
    password:string;
}