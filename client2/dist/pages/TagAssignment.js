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
import { useNavigate } from 'react-router-dom';
import RunnerService from '../services/runner.service';
import NfcService from '../services/nfc.service';
import ConfirmationModal from '../components/ConfirmationModal';
import './TagAssignment.css';
var TagAssignment = function () {
    var _a = useState([]), runners = _a[0], setRunners = _a[1];
    var _b = useState([]), unassignedTags = _b[0], setUnassignedTags = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useState(''), success = _e[0], setSuccess = _e[1];
    var _f = useState(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = useState(null), selectedRunner = _g[0], setSelectedRunner = _g[1];
    var _h = useState(null), selectedTag = _h[0], setSelectedTag = _h[1];
    var _j = useState(''), manualTagId = _j[0], setManualTagId = _j[1];
    var _k = useState(false), showConfirmModal = _k[0], setShowConfirmModal = _k[1];
    var _l = useState(false), showUnassignModal = _l[0], setShowUnassignModal = _l[1];
    var _m = useState(null), runnerToUnassign = _m[0], setRunnerToUnassign = _m[1];
    var navigate = useNavigate();
    useEffect(function () {
        fetchData();
    }, []);
    var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var runnersData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    setError('');
                    return [4 /*yield*/, RunnerService.getAll()];
                case 1:
                    runnersData = _a.sent();
                    setRunners(runnersData);
                    // Fetch unassigned tags
                    return [4 /*yield*/, fetchUnassignedTags()];
                case 2:
                    // Fetch unassigned tags
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError('Failed to load data: ' + (err_1.message || 'Unknown error'));
                    console.error(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchUnassignedTags = function () { return __awaiter(void 0, void 0, void 0, function () {
        var tags, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, NfcService.getUnassignedTags()];
                case 1:
                    tags = _a.sent();
                    setUnassignedTags(tags);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    setError('Failed to load unassigned tags: ' + (err_2.message || 'Unknown error'));
                    console.error(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAssignTag = function () {
        if (!selectedRunner) {
            setError('Please select a runner');
            return;
        }
        if (!selectedTag && !manualTagId) {
            setError('Please select or enter a tag ID');
            return;
        }
        // Use the selected tag or the manually entered one
        var tagId = selectedTag ? selectedTag.tagId : manualTagId;
        if (!tagId) {
            setError('Invalid tag ID');
            return;
        }
        // If manual tag ID entered, validate it
        if (manualTagId && !NfcService.isValidTagId(manualTagId)) {
            setError('Invalid tag ID format. Tag IDs should be hexadecimal (e.g., A1B2C3D4)');
            return;
        }
        setShowConfirmModal(true);
    };
    var confirmAssign = function () { return __awaiter(void 0, void 0, void 0, function () {
        var tagId, result, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    tagId = selectedTag ? selectedTag.tagId : manualTagId;
                    if (!selectedRunner || !tagId) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, NfcService.assignTagToRunner(tagId, selectedRunner.id)];
                case 1:
                    result = _a.sent();
                    setSuccess("Tag successfully assigned to ".concat(selectedRunner.firstName, " ").concat(selectedRunner.lastName));
                    setShowConfirmModal(false);
                    // Reset selections
                    setSelectedRunner(null);
                    setSelectedTag(null);
                    setManualTagId('');
                    // Refresh data
                    fetchData();
                    // Clear success message after a few seconds
                    setTimeout(function () {
                        setSuccess('');
                    }, 5000);
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    setError('Failed to assign tag: ' + (err_3.message || 'Unknown error'));
                    console.error(err_3);
                    setShowConfirmModal(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleShowUnassign = function (runner) {
        setRunnerToUnassign(runner);
        setShowUnassignModal(true);
    };
    var confirmUnassign = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!runnerToUnassign)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, NfcService.unassignTagFromRunner(runnerToUnassign.id)];
                case 2:
                    _a.sent();
                    setSuccess("Tag successfully unassigned from ".concat(runnerToUnassign.firstName, " ").concat(runnerToUnassign.lastName));
                    setShowUnassignModal(false);
                    setRunnerToUnassign(null);
                    // Refresh data
                    fetchData();
                    // Clear success message after a few seconds
                    setTimeout(function () {
                        setSuccess('');
                    }, 5000);
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    setError('Failed to unassign tag: ' + (err_4.message || 'Unknown error'));
                    console.error(err_4);
                    setShowUnassignModal(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var filteredRunners = searchTerm
        ? runners.filter(function (runner) {
            return runner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                runner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (runner.nickname && runner.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (runner.runnerNumber && runner.runnerNumber.toString().includes(searchTerm));
        })
        : runners;
    if (loading) {
        return React.createElement("div", { className: "loading" }, "Loading...");
    }
    return (React.createElement("div", { className: "tag-assignment-page" },
        React.createElement("div", { className: "page-header" },
            React.createElement("h1", null, "NFC Tag Assignment"),
            React.createElement("div", { className: "actions" },
                React.createElement("button", { onClick: function () { return navigate('/admin/runners'); }, className: "btn secondary" }, "Back to Runners"))),
        error && (React.createElement("div", { className: "alert alert-danger" },
            React.createElement("span", null, error),
            React.createElement("button", { onClick: function () { return setError(''); }, className: "close-button" }, "\u00D7"))),
        success && (React.createElement("div", { className: "alert alert-success" },
            React.createElement("span", null, success),
            React.createElement("button", { onClick: function () { return setSuccess(''); }, className: "close-button" }, "\u00D7"))),
        React.createElement("div", { className: "tag-assignment-container" },
            React.createElement("div", { className: "assignment-section" },
                React.createElement("h2", null, "Assign NFC Tag"),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "1. Select Runner:"),
                    React.createElement("div", { className: "search-box" },
                        React.createElement("input", { type: "text", placeholder: "Search runner by name or number...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); } })),
                    React.createElement("div", { className: "runners-list" }, filteredRunners.length === 0 ? (React.createElement("div", { className: "empty-message" }, "No runners found")) : (React.createElement("table", null,
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Number"),
                                React.createElement("th", null, "Name"),
                                React.createElement("th", null, "Category"),
                                React.createElement("th", null, "Tag Status"),
                                React.createElement("th", null, "Actions"))),
                        React.createElement("tbody", null, filteredRunners.map(function (runner) {
                            var _a;
                            return (React.createElement("tr", { key: runner.id, className: (selectedRunner === null || selectedRunner === void 0 ? void 0 : selectedRunner.id) === runner.id ? 'selected' : '', onClick: function () { return setSelectedRunner(runner); } },
                                React.createElement("td", null, runner.runnerNumber),
                                React.createElement("td", null,
                                    runner.firstName,
                                    " ",
                                    runner.lastName,
                                    runner.nickname && React.createElement("span", { className: "nickname" },
                                        "(",
                                        runner.nickname,
                                        ")")),
                                React.createElement("td", null, (_a = runner.category) === null || _a === void 0 ? void 0 : _a.name),
                                React.createElement("td", null, runner.nfcTagId ? (React.createElement("span", { className: "tag-assigned" }, NfcService.formatTagId(runner.nfcTagId))) : (React.createElement("span", { className: "no-tag" }, "No Tag"))),
                                React.createElement("td", null, runner.nfcTagId ? (React.createElement("button", { onClick: function (e) {
                                        e.stopPropagation();
                                        handleShowUnassign(runner);
                                    }, className: "btn btn-small btn-warning" }, "Unassign")) : (React.createElement("button", { onClick: function (e) {
                                        e.stopPropagation();
                                        setSelectedRunner(runner);
                                    }, className: "btn btn-small btn-primary" }, "Select")))));
                        })))))),
                selectedRunner && !selectedRunner.nfcTagId && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", null, "2. Select or Enter NFC Tag ID:"),
                        React.createElement("div", { className: "tag-options" },
                            React.createElement("div", { className: "tag-option" },
                                React.createElement("h3", null, "Option A: Select from unassigned tags"),
                                React.createElement("div", { className: "unassigned-tags" }, unassignedTags.length === 0 ? (React.createElement("div", { className: "empty-message" }, "No unassigned tags available")) : (React.createElement("div", { className: "tags-grid" }, unassignedTags.map(function (tag) { return (React.createElement("div", { key: tag.id, className: "tag-item ".concat((selectedTag === null || selectedTag === void 0 ? void 0 : selectedTag.id) === tag.id ? 'selected' : ''), onClick: function () {
                                        setSelectedTag(tag);
                                        setManualTagId('');
                                    } },
                                    React.createElement("div", { className: "tag-id" }, NfcService.formatTagId(tag.tagId)),
                                    React.createElement("div", { className: "tag-seen" },
                                        "First seen: ",
                                        new Date(tag.firstSeen).toLocaleString()))); }))))),
                            React.createElement("div", { className: "tag-option" },
                                React.createElement("h3", null, "Option B: Manually enter tag ID"),
                                React.createElement("div", { className: "manual-tag" },
                                    React.createElement("input", { type: "text", placeholder: "Enter NFC tag ID (hex format e.g., A1B2C3D4)", value: manualTagId, onChange: function (e) {
                                            setManualTagId(e.target.value);
                                            setSelectedTag(null);
                                        } }),
                                    React.createElement("div", { className: "help-text" }, "Tag IDs should be hexadecimal format (e.g., A1B2C3D4)"))))),
                    React.createElement("div", { className: "form-actions" },
                        React.createElement("button", { onClick: handleAssignTag, className: "btn btn-primary", disabled: !selectedRunner || (!selectedTag && !manualTagId) }, "Assign Tag to Runner"),
                        React.createElement("button", { onClick: function () {
                                setSelectedRunner(null);
                                setSelectedTag(null);
                                setManualTagId('');
                            }, className: "btn btn-secondary" }, "Cancel"))))),
            React.createElement("div", { className: "info-section" },
                React.createElement("h2", null, "How to Assign NFC Tags"),
                React.createElement("ol", null,
                    React.createElement("li", null, "Select a runner from the list on the left."),
                    React.createElement("li", null,
                        "Either:",
                        React.createElement("ul", null,
                            React.createElement("li", null, "Select an existing unassigned tag from the list, or"),
                            React.createElement("li", null, "Manually enter a new tag ID."))),
                    React.createElement("li", null, "Click \"Assign Tag to Runner\" to complete the assignment.")),
                React.createElement("h3", null, "About NFC Tags"),
                React.createElement("p", null, "NFC tags can be scanned by the hardware to automatically log laps for runners during races. Each runner should have a unique tag assigned."),
                React.createElement("h3", null, "Adding New Tags"),
                React.createElement("p", null, "New tags can be added to the system by:"),
                React.createElement("ul", null,
                    React.createElement("li", null, "Manually entering the tag ID in the form"),
                    React.createElement("li", null, "Scanning the tag with the NFC hardware, which will automatically register it as unassigned")))),
        showConfirmModal && selectedRunner && (React.createElement(ConfirmationModal, { isOpen: showConfirmModal, title: "Confirm Tag Assignment", message: "Are you sure you want to assign ".concat(selectedTag ? 'tag ' + NfcService.formatTagId(selectedTag.tagId) : 'tag ' + manualTagId, " to runner ").concat(selectedRunner.firstName, " ").concat(selectedRunner.lastName, "?"), confirmText: "Assign", cancelText: "Cancel", confirmButtonClass: "btn-primary", onConfirm: confirmAssign, onCancel: function () { return setShowConfirmModal(false); } })),
        showUnassignModal && runnerToUnassign && (React.createElement(ConfirmationModal, { isOpen: showUnassignModal, title: "Confirm Tag Unassignment", message: "Are you sure you want to unassign the NFC tag from runner ".concat(runnerToUnassign.firstName, " ").concat(runnerToUnassign.lastName, "?"), confirmText: "Unassign", cancelText: "Cancel", confirmButtonClass: "btn-warning", onConfirm: confirmUnassign, onCancel: function () {
                setShowUnassignModal(false);
                setRunnerToUnassign(null);
            } }))));
};
export default TagAssignment;
