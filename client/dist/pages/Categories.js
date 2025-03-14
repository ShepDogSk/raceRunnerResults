var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from '../services/category.service';
import './Categories.css';
var Categories = function () {
    var _a = useState([]), categories = _a[0], setCategories = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(''), error = _c[0], setError = _c[1];
    var _d = useState(false), showDeleteModal = _d[0], setShowDeleteModal = _d[1];
    var _e = useState(null), categoryToDelete = _e[0], setCategoryToDelete = _e[1];
    useEffect(function () {
        fetchCategories();
    }, []);
    var fetchCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, CategoryService.getAll()];
                case 1:
                    data = _a.sent();
                    setCategories(data);
                    setError('');
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError('Failed to load categories');
                    console.error(err_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteClick = function (category) {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };
    var confirmDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!categoryToDelete)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, CategoryService.delete(categoryToDelete.id)];
                case 2:
                    _a.sent();
                    setCategories(categories.filter(function (c) { return c.id !== categoryToDelete.id; }));
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setError('Failed to delete category');
                    console.error(err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var cancelDelete = function () {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };
    if (loading) {
        return React.createElement("div", { className: "loading" });
    }
    return (React.createElement("div", { className: "categories-page" },
        React.createElement("div", { className: "actions-bar" },
            React.createElement("h1", { className: "page-title" }, "Race Categories"),
            React.createElement(Link, { to: "/admin/categories/new", className: "btn" }, "Add Category")),
        error && React.createElement("div", { className: "alert alert-danger" }, error),
        categories.length === 0 ? (React.createElement("div", { className: "empty-state" },
            React.createElement("p", null, "No categories found. Create your first race category!"),
            React.createElement(Link, { to: "/admin/categories/new", className: "btn" }, "Add Category"))) : (React.createElement("div", { className: "categories-list" },
            React.createElement("table", null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "ID"),
                        React.createElement("th", null, "Name"),
                        React.createElement("th", null, "Distance (km)"),
                        React.createElement("th", null, "Year"),
                        React.createElement("th", null, "Actions"))),
                React.createElement("tbody", null, categories.map(function (category) { return (React.createElement("tr", { key: category.id },
                    React.createElement("td", null, category.id),
                    React.createElement("td", null, category.name),
                    React.createElement("td", null, category.distance),
                    React.createElement("td", null, category.year),
                    React.createElement("td", { className: "actions" },
                        React.createElement(Link, { to: "/admin/categories/edit/".concat(category.id), className: "btn-edit" }, "Edit"),
                        React.createElement("button", { onClick: function () { return handleDeleteClick(category); }, className: "btn-delete" }, "Delete")))); }))))),
        showDeleteModal && (React.createElement("div", { className: "modal-overlay" },
            React.createElement("div", { className: "modal" },
                React.createElement("h3", null, "Confirm Delete"),
                React.createElement("p", null,
                    "Are you sure you want to delete the category \"", categoryToDelete === null || categoryToDelete === void 0 ? void 0 :
                    categoryToDelete.name,
                    "\"?"),
                React.createElement("p", { className: "warning" }, "This action cannot be undone!"),
                React.createElement("div", { className: "modal-actions" },
                    React.createElement("button", { onClick: cancelDelete, className: "btn btn-outline" }, "Cancel"),
                    React.createElement("button", { onClick: confirmDelete, className: "btn btn-danger" }, "Delete")))))));
};
export default Categories;
