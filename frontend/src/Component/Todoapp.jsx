import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Utility function to decode JWT token and check expiry
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    const exp = decoded.exp * 1000; // Expiry time in ms
    return Date.now() >= exp;
};

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTodos = async () => {
            let token = localStorage.getItem("access");
    
            // Log the Authorization header to ensure it's correctly set
            console.log("Authorization Header:", { Authorization: `Bearer ${token}` });
    
            // Check token expiry
            if (token && isTokenExpired(token)) {
                try {
                    token = await refreshAccessToken();
                    if (!token) return;  // If refreshing fails, exit
                } catch (error) {
                    console.error("Error refreshing token:", error);
                    alert("Session expired. Please log in again.");
                    navigate("/login");
                    return;
                }
            }
    
            if (token) {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/todos/", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("Todos fetched successfully:", response);
                    setTodos(response.data);
                } catch (error) {
                    console.error("Error fetching todos:", error);
                    if (error.response) {
                        console.error("Response status:", error.response.status);
                        console.error("Response data:", error.response.data);
                    }
                    if (error.response?.status === 401) {
                        alert("Session expired. Please log in again.");
                        navigate("/login");
                    }
                }
            } else {
                alert("No access token found. Please log in.");
                navigate("/login");
            }
        };
    
        fetchTodos();
    }, [navigate]);
    
    
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            console.error("No refresh token found.");
            throw new Error("No refresh token found.");
        }
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/token/refresh/", {
                refresh: refreshToken,
            });
    
            if (response.data?.access) {
                console.log("Access token refreshed:", response.data.access);
                localStorage.setItem("access", response.data.access);
                return response.data.access;
            } else {
                console.error("No access token in response.");
                throw new Error("Failed to refresh access token.");
            }
        } catch (error) {
            console.error("Failed to refresh token:", error);
            throw new Error("Failed to refresh token.");
        }
    };
    
    const isTokenExpired = (token) => {
        const decoded = decodeToken(token);
        if (!decoded) return true; // Token is invalid or expired
        const exp = decoded.exp * 1000; // Expiry time in ms
        return Date.now() >= exp;
    };
    
    const addTodo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access");
            const response = await axios.post("http://127.0.0.1:8000/todos/", 
                { title: newTodo, completed: false }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos([...todos, response.data]);
            setNewTodo("");
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem("access");
            await axios.delete(`http://127.0.0.1:8000/todos/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return (
        <div>
            <h2>Todo List</h2>
            <form onSubmit={addTodo}>
                <input
                    type="text"
                    placeholder="Add a new todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    required
                />
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.title}
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoApp;
