import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
var Header = function (_a) {
    var isAuthenticated = _a.isAuthenticated, onLogout = _a.onLogout;
    return (React.createElement("header", { className: "header" },
        React.createElement("div", { className: "container header-content" },
            React.createElement(Link, { to: "/", className: "logo" },
                React.createElement("h1", null, "Race Runner")),
            React.createElement("nav", { className: "nav" },
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement(Link, { to: "/results" }, "Results")),
                    isAuthenticated ? (React.createElement(React.Fragment, null,
                        React.createElement("li", null,
                            React.createElement(Link, { to: "/admin/dashboard" }, "Dashboard")),
                        React.createElement("li", null,
                            React.createElement(Link, { to: "/admin/categories" }, "Categories")),
                        React.createElement("li", null,
                            React.createElement(Link, { to: "/admin/runners" }, "Runners")),
                        React.createElement("li", null,
                            React.createElement(Link, { to: "/admin/tags" }, "NFC Tags")),
                        React.createElement("li", null,
                            React.createElement(Link, { to: "/admin/nfc-logs" }, "NFC Logs")),
                        React.createElement("li", null,
                            React.createElement("button", { onClick: onLogout, className: "btn-logout" }, "Logout")))) : (React.createElement("li", null,
                        React.createElement(Link, { to: "/login", className: "btn-login" }, "Admin Login"))))))));
};
export default Header;
