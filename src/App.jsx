import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes'; // Adjust the import path as necessary

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/message', { withCredentials: true })
      .then(response => setMessage(response.data))
      .catch(error => console.error('There was an error!', error));
  }, []);

  return (
    <BrowserRouter>
      <div>
        <p>{message}</p>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
