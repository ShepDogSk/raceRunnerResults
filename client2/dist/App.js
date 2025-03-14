import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Runners from './pages/Runners';
import RunnerForm from './pages/RunnerForm';
import TagAssignment from './pages/TagAssignment';
import NfcLogs from './pages/NfcLogs';
import RaceResults from './pages/RaceResults';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
var App = function () {
    var _a = useState(false), isAuthenticated = _a[0], setIsAuthenticated = _a[1];
    useEffect(function () {
        // Check if user is authenticated
        var token = localStorage.getItem('token');
        console.log('App initialization - Token exists:', !!token);
        if (token) {
            setIsAuthenticated(true);
            console.log('User authenticated on app load');
        }
        else {
            console.log('No authentication token found on app load');
        }
    }, []);
    var handleLogout = function () {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };
    return (React.createElement("div", { className: "app" },
        React.createElement(Header, { isAuthenticated: isAuthenticated, onLogout: handleLogout }),
        React.createElement("main", { className: "main-content" },
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(RaceResults, null) }),
                React.createElement(Route, { path: "/results", element: React.createElement(RaceResults, null) }),
                React.createElement(Route, { path: "/login", element: isAuthenticated ? React.createElement(Navigate, { to: "/admin/dashboard" }) : React.createElement(Login, { setIsAuthenticated: setIsAuthenticated }) }),
                React.createElement(Route, { path: "/admin/dashboard", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(Dashboard, null)) }),
                React.createElement(Route, { path: "/admin/categories", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(Categories, null)) }),
                React.createElement(Route, { path: "/admin/categories/new", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(CategoryForm, null)) }),
                React.createElement(Route, { path: "/admin/categories/edit/:id", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(CategoryForm, null)) }),
                React.createElement(Route, { path: "/admin/runners", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(Runners, null)) }),
                React.createElement(Route, { path: "/admin/runners/new", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(RunnerForm, null)) }),
                React.createElement(Route, { path: "/admin/runners/edit/:id", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(RunnerForm, null)) }),
                React.createElement(Route, { path: "/admin/tags", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(TagAssignment, null)) }),
                React.createElement(Route, { path: "/admin/nfc-logs", element: React.createElement(ProtectedRoute, { isAuthenticated: isAuthenticated },
                        React.createElement(NfcLogs, null)) }))),
        React.createElement(Footer, null)));
};
export default App;
