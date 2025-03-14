import React from 'react';
import './Footer.css';
var Footer = function () {
    var currentYear = new Date().getFullYear();
    return (React.createElement("footer", { className: "footer" },
        React.createElement("div", { className: "container" },
            React.createElement("p", null,
                "\u00A9 ",
                currentYear,
                " Race Runner Management System. All rights reserved."))));
};
export default Footer;
