import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import socketService from './services/socket.service';
// Initialize the WebSocket connection
socketService.init();
var container = document.getElementById('root');
var root = createRoot(container);
root.render(React.createElement(React.StrictMode, null,
    React.createElement(BrowserRouter, null,
        React.createElement(App, null))));
