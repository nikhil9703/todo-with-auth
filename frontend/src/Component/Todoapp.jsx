import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const token = 'your-token';  // Replace with the actual token

  useEffect(() => {
    // Fetch todos
    axios.get('http://127.0.0.1:8000/todos/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      setTodos(response.data);
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
    });
  }, []);

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>
            <p>Status: {todo.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;