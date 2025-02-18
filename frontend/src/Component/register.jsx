import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("Error: " + (errorData.error || "Something went wrong"));
                return;
            }

            alert("User registered successfully!");
            navigate("/login");
            setFormData({ username: "", email: "", password: "", confirmPassword: "" }); // Reset form

        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to connect to the server. Please try again.");
        }
    };

    return (
        <div>
            <h2 className="register_title">REGISTER</h2>
            <form onSubmit={handleSubmit}>
                <div className="text">Name</div>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                <div className="text">Email</div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <div className="text">Password</div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <div className="text">Confirm Password</div>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

                <br />
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
