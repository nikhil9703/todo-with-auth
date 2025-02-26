import React, { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api";
import './ToDoList.css';


const ToDoList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", description: "", status: "Pending" });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchTasks();
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to load tasks.");
        }
        setLoading(false);
    };

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.description) {
            alert("Title and Description are required!");
            return;
        }
        try {
            await createTask(newTask);
            setNewTask({ title: "", description: "", status: "Pending" });
            loadTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleUpdateTask = async () => {
        if (!editingTask.title || !editingTask.description) {
            alert("Title and Description are required!");
            return;
        }
        try {
            await updateTask(editingTask.id, editingTask);
            setEditingTask(null);
            loadTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(id);
            loadTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="todo-container">
            <h2>To-Do List</h2>

            {error && <p className="error-message">{error}</p>}

            {/* Task Table */}
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

            {/* Add / Edit Task */}
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
        </div>
    );
};

export default ToDoList;
