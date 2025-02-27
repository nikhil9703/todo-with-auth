import React, { useState, useContext } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type = "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            console.log("Login response:", response.data);
            const accessToken = response.data.access;
            const username = formData.username;
            loginUser(accessToken, username);
            navigate("/todo");
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error);
            showNotification("Invalid credentials", "error"); 
        }
    };

    return (
        <form className="formcont" onSubmit={handleSubmit}>
            <h3 className="form-title">Login</h3>
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
            <p><a href="/forgot-password">Forgot Password?</a></p>
            {notification && (
                <div className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}>
                    {notification.message}
                </div>
            )}
        </form>
    );
};

export default Login;