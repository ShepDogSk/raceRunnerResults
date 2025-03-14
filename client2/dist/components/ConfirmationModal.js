import React from 'react';
import './ConfirmationModal.css';
var ConfirmationModal = function (_a) {
    var isOpen = _a.isOpen, title = _a.title, message = _a.message, confirmText = _a.confirmText, cancelText = _a.cancelText, _b = _a.confirmButtonClass, confirmButtonClass = _b === void 0 ? 'btn-primary' : _b, onConfirm = _a.onConfirm, onCancel = _a.onCancel;
    if (!isOpen)
        return null;
    return (React.createElement("div", { className: "modal-overlay" },
        React.createElement("div", { className: "modal" },
            React.createElement("h3", null, title),
            React.createElement("p", null, message),
            React.createElement("div", { className: "modal-actions" },
                React.createElement("button", { onClick: onCancel, className: "btn btn-outline" }, cancelText),
                React.createElement("button", { onClick: onConfirm, className: "btn ".concat(confirmButtonClass) }, confirmText)))));
};
export default ConfirmationModal;
