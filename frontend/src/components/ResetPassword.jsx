import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api";
import "./ResetPassword.css"

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await resetPassword(uid, token, password);
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password");
        }
    };

    return (
        <div className="reset-password-container">
            <h3>Reset Password</h3>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            <p><a href="/login">Back to Login</a></p>
        </div>
    );
};

export default ResetPassword;