import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access") || null);

    const logoutUser = useCallback(() => {
        console.log("Logging out...");
        localStorage.removeItem("access");
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);

                const expireTime = decodedUser.exp * 1000; // Token expiration in milliseconds
                const currentTime = Date.now();
                if (expireTime < currentTime) {
                    logoutUser();
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                logoutUser();
            }
        } else {
            setUser(null);
        }
    }, [token, logoutUser]);

    const loginUser = (newAccess) => {
        try {
            const decodedUser = jwtDecode(newAccess);
            localStorage.setItem("access", newAccess);
            setToken(newAccess);
            setUser(decodedUser);
        } catch (error) {
            console.error("Error decoding token during login:", error);
            logoutUser();
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;