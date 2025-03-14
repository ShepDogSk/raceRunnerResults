var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryService from '../services/category.service';
import './CategoryForm.css';
var CategoryForm = function () {
    var id = useParams().id;
    var navigate = useNavigate();
    var isEditMode = !!id;
    var _a = useState({
        name: '',
        distance: 0,
        year: new Date().getFullYear()
    }), formData = _a[0], setFormData = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(''), error = _c[0], setError = _c[1];
    useEffect(function () {
        if (isEditMode) {
            fetchCategory();
        }
    }, [id]);
    var fetchCategory = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, CategoryService.getById(parseInt(id))];
                case 1:
                    data = _a.sent();
                    setFormData(data);
                    setError('');
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError('Failed to load category');
                    console.error(err_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = name === 'distance' || name === 'year' ? parseFloat(value) : value, _a)));
        });
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2, errorMessage;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    console.log('Category form submission:', formData);
                    if (!formData.name || !formData.distance || !formData.year) {
                        setError('Please fill in all required fields');
                        console.warn('Form validation failed - missing required fields');
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    setLoading(true);
                    setError('');
                    console.log("Attempting to ".concat(isEditMode ? 'update' : 'create', " category"));
                    if (!isEditMode) return [3 /*break*/, 3];
                    console.log("Updating category with ID: ".concat(id));
                    return [4 /*yield*/, CategoryService.update(parseInt(id), formData)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 3:
                    console.log('Creating new category');
                    return [4 /*yield*/, CategoryService.create(formData)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    console.log('Category saved successfully, redirecting to categories list');
                    navigate('/admin/categories');
                    return [3 /*break*/, 8];
                case 6:
                    err_2 = _c.sent();
                    errorMessage = ((_b = (_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to save category';
                    console.error('Error saving category:', errorMessage, err_2);
                    setError(errorMessage);
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    if (loading && isEditMode) {
        return React.createElement("div", { className: "loading" });
    }
    return (React.createElement("div", { className: "category-form-page" },
        React.createElement("h1", { className: "page-title" }, isEditMode ? 'Edit Category' : 'Add Category'),
        error && React.createElement("div", { className: "alert alert-danger" }, error),
        React.createElement("div", { className: "form-container" },
            React.createElement("form", { onSubmit: handleSubmit },
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "name" }, "Category Name*"),
                    React.createElement("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, disabled: loading, required: true })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "distance" }, "Distance (km)*"),
                    React.createElement("input", { type: "number", id: "distance", name: "distance", value: formData.distance, onChange: handleChange, disabled: loading, step: "0.1", min: "0", required: true })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "year" }, "Year*"),
                    React.createElement("input", { type: "number", id: "year", name: "year", value: formData.year, onChange: handleChange, disabled: loading, min: "2000", max: "2100", required: true })),
                React.createElement("div", { className: "form-actions" },
                    React.createElement("button", { type: "button", className: "btn btn-outline", onClick: function () { return navigate('/admin/categories'); }, disabled: loading }, "Cancel"),
                    React.createElement("button", { type: "submit", className: "btn", disabled: loading }, loading ? 'Saving...' : 'Save Category'))))));
};
export default CategoryForm;
