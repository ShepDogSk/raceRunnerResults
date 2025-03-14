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
import RunnerService from '../services/runner.service';
import CategoryService from '../services/category.service';
import './RunnerForm.css';
var RunnerForm = function () {
    var _a;
    var id = useParams().id;
    var navigate = useNavigate();
    var isEditMode = !!id;
    var _b = useState([]), categories = _b[0], setCategories = _b[1];
    var _c = useState({
        runnerNumber: 0,
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        category: undefined,
        internalNote: '',
        nfcChipId: '',
        isStarted: false,
        totalLaps: 0,
        totalDistance: 0
    }), formData = _c[0], setFormData = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    useEffect(function () {
        fetchCategories();
        if (isEditMode) {
            fetchRunner();
        }
    }, [id]);
    var fetchCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, CategoryService.getAll()];
                case 1:
                    data_1 = _a.sent();
                    setCategories(data_1);
                    // Set default category if creating a new runner
                    if (!isEditMode && data_1.length > 0) {
                        setFormData(function (prev) { return (__assign(__assign({}, prev), { category: data_1[0] })); });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error('Failed to load categories', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchRunner = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, RunnerService.getById(parseInt(id))];
                case 1:
                    data = _a.sent();
                    setFormData(data);
                    setError('');
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    setError('Failed to load runner');
                    console.error(err_2);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value, type = _a.type;
        if (name === 'categoryId') {
            var selectedCategory_1 = categories.find(function (cat) { return cat.id === parseInt(value); });
            setFormData(function (prev) { return (__assign(__assign({}, prev), { category: selectedCategory_1 })); });
        }
        else {
            setFormData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = type === 'number' ? parseFloat(value) : value, _a)));
            });
        }
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var runnerData, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.runnerNumber || !formData.firstName || !formData.lastName || !formData.category) {
                        setError('Please fill in all required fields');
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    setLoading(true);
                    setError('');
                    runnerData = __assign(__assign({}, formData), { isStarted: formData.isStarted || false, totalLaps: formData.totalLaps || 0, totalDistance: formData.totalDistance || 0 });
                    if (!isEditMode) return [3 /*break*/, 3];
                    return [4 /*yield*/, RunnerService.update(parseInt(id), runnerData)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, RunnerService.create(runnerData)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    navigate('/admin/runners');
                    return [3 /*break*/, 8];
                case 6:
                    err_3 = _c.sent();
                    setError(((_b = (_a = err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to save runner');
                    console.error(err_3);
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
    return (React.createElement("div", { className: "runner-form-page" },
        React.createElement("h1", { className: "page-title" }, isEditMode ? 'Edit Runner' : 'Add Runner'),
        error && React.createElement("div", { className: "alert alert-danger" }, error),
        React.createElement("div", { className: "form-container" },
            React.createElement("form", { onSubmit: handleSubmit },
                React.createElement("div", { className: "form-row" },
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { htmlFor: "runnerNumber" }, "Runner Number*"),
                        React.createElement("input", { type: "number", id: "runnerNumber", name: "runnerNumber", value: formData.runnerNumber, onChange: handleChange, disabled: loading, min: "1", required: true })),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { htmlFor: "categoryId" }, "Category*"),
                        React.createElement("select", { id: "categoryId", name: "categoryId", value: (_a = formData.category) === null || _a === void 0 ? void 0 : _a.id, onChange: handleChange, disabled: loading, required: true },
                            React.createElement("option", { value: "" }, "Select Category"),
                            categories.map(function (category) { return (React.createElement("option", { key: category.id, value: category.id },
                                category.name,
                                " (",
                                category.distance,
                                "km)")); })))),
                React.createElement("div", { className: "form-row" },
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { htmlFor: "firstName" }, "First Name*"),
                        React.createElement("input", { type: "text", id: "firstName", name: "firstName", value: formData.firstName, onChange: handleChange, disabled: loading, required: true })),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { htmlFor: "lastName" }, "Last Name*"),
                        React.createElement("input", { type: "text", id: "lastName", name: "lastName", value: formData.lastName, onChange: handleChange, disabled: loading, required: true }))),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "nickname" }, "Nickname"),
                    React.createElement("input", { type: "text", id: "nickname", name: "nickname", value: formData.nickname || '', onChange: handleChange, disabled: loading })),
                React.createElement("div", { className: "form-row" },
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { htmlFor: "email" }, "Email"),
                        React.createElement("input", { type: "email", id: "email", name: "email", value: formData.email || '', onChange: handleChange, disabled: loading })),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { htmlFor: "phoneNumber" }, "Phone Number"),
                        React.createElement("input", { type: "tel", id: "phoneNumber", name: "phoneNumber", value: formData.phoneNumber || '', onChange: handleChange, disabled: loading }))),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "nfcChipId" }, "NFC Chip ID"),
                    React.createElement("input", { type: "text", id: "nfcChipId", name: "nfcChipId", value: formData.nfcChipId || '', onChange: handleChange, disabled: loading })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "internalNote" }, "Internal Note"),
                    React.createElement("textarea", { id: "internalNote", name: "internalNote", value: formData.internalNote || '', onChange: handleChange, disabled: loading, rows: 3 })),
                React.createElement("div", { className: "form-actions" },
                    React.createElement("button", { type: "button", className: "btn btn-outline", onClick: function () { return navigate('/admin/runners'); }, disabled: loading }, "Cancel"),
                    React.createElement("button", { type: "submit", className: "btn", disabled: loading }, loading ? 'Saving...' : 'Save Runner'))))));
};
export default RunnerForm;
