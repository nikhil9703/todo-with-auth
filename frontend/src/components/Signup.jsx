import React, { useState, useContext } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmpassword: "" });
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signup(formData);
            const accessToken = response.data.tokens.access;
            loginUser(accessToken);
            navigate("/todo");
        } catch (error) {
            alert(error.response?.data?.error || "Signup failed");
        }
    };

    return (
        <form className="formcont" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
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
            <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
            />
            <button type="submit">Signup</button>
        </form>
    );
};

export default Signup;