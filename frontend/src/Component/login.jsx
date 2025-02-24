import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,[e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", {
                username: formData.username,
                password: formData.password,
            });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            navigate("/todoapp"); 
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Invalid Credentials");
        }
    };

    return (
        <div>
            <h2 className="login_title">LOG-IN</h2>
            <form onSubmit={handleLogin}>
                <div className="text">Username</div>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <br /><br />
                <div className="text">Password</div>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br /><br />
                <button type="submit">Login</button><br />
            </form >
            <button type="forget"  onClick={()=>navigate("/forget-password")}>reset_password</button>
            {error && <p className="error_msg">{error}</p>}
        </div>
    );
}

export default Login;