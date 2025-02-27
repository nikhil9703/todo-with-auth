import React, { useState } from "react";
import { requestPasswordReset } from "../api";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestPasswordReset(email);
            setMessage(response.data.message); 
            setTimeout(() => navigate("/login"), 2000); 
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send reset email");
        }
    };

    return (
        <div className="forgot-password-container">
            <h3>Forgot Password</h3>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            <p><a href="/login">Back to Login</a></p>
        </div>
    );
};

export default ForgotPassword;