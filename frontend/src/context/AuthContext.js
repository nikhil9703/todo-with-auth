
import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");

    const logoutUser = useCallback(() => {
        console.log("Logging out...");
        localStorage.removeItem("access");
        localStorage.removeItem("username");
        setToken(null);
        setUser(null);
        setUsername("Guest");
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                setUsername(decodedUser.username || "Guest");
                localStorage.setItem("username", decodedUser.username || "Guest");

                const expireTime = decodedUser.exp * 1000; 
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
            setUsername("Guest");
        }
    }, [token, logoutUser]);

    const loginUser = (newAccess, userName) => {
        try {
            const decodedUser = jwtDecode(newAccess);
            const username = userName || decodedUser.username || "Guest";

            localStorage.setItem("access", newAccess);
            localStorage.setItem("username", username);
            setToken(newAccess);
            setUsername(username);
            setUser(decodedUser);
        } catch (error) {
            console.error("Error decoding token during login:", error);
            logoutUser();
        }
    };

    return (
        <AuthContext.Provider value={{ user, username, loginUser, logoutUser, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
