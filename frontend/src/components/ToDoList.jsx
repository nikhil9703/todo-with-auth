
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api";
import './ToDoList.css';

const ToDoList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", description: "", status: "Pending" });
    const [editingTask, setEditingTask] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [notification, setNotification] = useState({ message: null, type: null }); 

    const navigate = useNavigate();

    useEffect(() => {
        loadTasks();
    }, []);
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: null, type: null }), 5000);
    };
    const handleUnauthorized = () => {
        localStorage.removeItem("access");
        navigate("/login");
    };
    const loadTasks = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchTasks(page);
            setTasks(response.data.results);
            setNextPage(response.data.next ? page + 1 : null);
            setPrevPage(response.data.previous ? page - 1 : null);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
            } else {
                setError("Failed to load tasks.");
            }
        }
        setLoading(false);
    };

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.description) {
            showNotification("Title and Description are required!", "error");
            return;
        }
        try {
            await createTask(newTask);
            setNewTask({ title: "", description: "", status: "Pending" });
            showNotification("Task added successfully!", "success");
            loadTasks(currentPage);
        } catch (error) {
            console.error("Error creating task:", error);
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
            } else {
                showNotification("Failed to add task.", "error");
            }
        }
    };

    const handleUpdateTask = async () => {
        if (!editingTask.title || !editingTask.description) {
            showNotification("Title and Description are required!", "error");
            return;
        }
        try {
            await updateTask(editingTask.id, editingTask);
            setEditingTask(null);
            showNotification("Task updated successfully!", "success");
            loadTasks(currentPage);
        } catch (error) {
            console.error("Error updating task:", error);
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
            } else {
                showNotification("Failed to update task.", "error");
            }
        }
    };

    const handleDeleteTask = async (id) => {
        // if (!window.confirm("Are you sure you want to delete this task?")) return;s
        try {
            await deleteTask(id);
            showNotification("Task deleted successfully!", "success");
            loadTasks(currentPage);
        } catch (error) {
            console.error("Error deleting task:", error);
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
            } else {
                showNotification("Failed to delete task.", "error");
            }
        }
    };

    const goToNextPage = () => {
        if (nextPage) {
            loadTasks(nextPage);
        }
    };

    const goToPrevPage = () => {
        if (prevPage) {
            loadTasks(prevPage);
        }
    };

    return (
        <div className="todo-container">
            <h2>To-Do List</h2>
            {error && <p className="error-message">{error}</p>}
            {notification.message && (
                <div className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}>
                    {notification.message}
                </div>
            )}

            <div className="task-form">
                <h3>{editingTask ? "Edit Task" : "Add Task"}</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={editingTask ? editingTask.title : newTask.title}
                    onChange={(e) => {
                        const value = e.target.value;
                        editingTask ? setEditingTask({ ...editingTask, title: value }) : setNewTask({ ...newTask, title: value });
                    }}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={editingTask ? editingTask.description : newTask.description}
                    onChange={(e) => {
                        const value = e.target.value;
                        editingTask ? setEditingTask({ ...editingTask, description: value }) : setNewTask({ ...newTask, description: value });
                    }}
                />
                <select
                    value={editingTask ? editingTask.status : newTask.status}
                    onChange={(e) => {
                        const value = e.target.value;
                        editingTask ? setEditingTask({ ...editingTask, status: value }) : setNewTask({ ...newTask, status: value });
                    }}
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
                <button onClick={editingTask ? handleUpdateTask : handleCreateTask}>
                    {editingTask ? "Update Task" : "Add Task"}
                </button>
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.status}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => setEditingTask(task)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No tasks found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <div className="pagination-controls">
                <button onClick={goToPrevPage} disabled={!prevPage}>Previous</button>
                <span>Page {currentPage}</span>
                <button onClick={goToNextPage} disabled={!nextPage}>Next</button>
            </div>
        </div>
    );
};

export default ToDoList;