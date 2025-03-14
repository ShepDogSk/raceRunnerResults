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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import RunnerService from '../services/runner.service';
import CategoryService from '../services/category.service';
import socketService from '../services/socket.service';
import ConfirmationModal from '../components/ConfirmationModal';
import RunnerDiploma from '../components/RunnerDiploma';
import './Runners.css';
var Runners = function () {
    var _a = useState([]), runners = _a[0], setRunners = _a[1];
    var _b = useState([]), categories = _b[0], setCategories = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useState('all'), selectedCategory = _e[0], setSelectedCategory = _e[1];
    // Modal states
    var _f = useState(false), showDeleteModal = _f[0], setShowDeleteModal = _f[1];
    var _g = useState(null), runnerToDelete = _g[0], setRunnerToDelete = _g[1];
    var _h = useState(false), showActionModal = _h[0], setShowActionModal = _h[1];
    var _j = useState(null), actionModalData = _j[0], setActionModalData = _j[1];
    var _k = useState(false), showDiplomaModal = _k[0], setShowDiplomaModal = _k[1];
    var _l = useState(null), diplomaData = _l[0], setDiplomaData = _l[1];
    // Timer for updating running times
    var timerRef = useRef(null);
    var _m = useState({}), runningTimes = _m[0], setRunningTimes = _m[1];
    useEffect(function () {
        fetchData();
        // Set up socket subscription for real-time updates
        var unsubscribeRunnerUpdated = socketService.subscribe('runner.updated', function (runner) {
            console.log("Runner updated: ".concat(runner.id));
            fetchData();
        });
        var unsubscribeRunnerStarted = socketService.subscribe('runner.started', function (runner) {
            console.log("Runner started: ".concat(runner.id));
            fetchData();
        });
        var unsubscribeRunnerPaused = socketService.subscribe('runner.paused', function (runner) {
            console.log("Runner paused: ".concat(runner.id));
            fetchData();
        });
        var unsubscribeRunnerResumed = socketService.subscribe('runner.resumed', function (runner) {
            console.log("Runner resumed: ".concat(runner.id));
            fetchData();
        });
        var unsubscribeRunnerFinished = socketService.subscribe('runner.finished', function (runner) {
            console.log("Runner finished: ".concat(runner.id));
            fetchData();
        });
        var unsubscribeLapCreated = socketService.subscribe('lap.created', function (lap) {
            var _a;
            console.log("New lap logged for runner: ".concat((_a = lap.runner) === null || _a === void 0 ? void 0 : _a.id));
            fetchData();
        });
        return function () {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            // Clean up socket subscriptions
            unsubscribeRunnerUpdated();
            unsubscribeRunnerStarted();
            unsubscribeRunnerPaused();
            unsubscribeRunnerResumed();
            unsubscribeRunnerFinished();
            unsubscribeLapCreated();
        };
    }, []);
    var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runnersData, categoriesData, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, Promise.all([
                            RunnerService.getAll(),
                            CategoryService.getAll()
                        ])];
                case 1:
                    _a = _b.sent(), runnersData = _a[0], categoriesData = _a[1];
                    setRunners(runnersData);
                    setCategories(categoriesData);
                    setError('');
                    // Start timer to update running times
                    startRunningTimeTimer(runnersData);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _b.sent();
                    setError('Failed to load data');
                    console.error(err_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Start a timer to update running times every second
    var startRunningTimeTimer = function (runnersList) {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(function () {
            var times = {};
            runnersList.forEach(function (runner) {
                if (runner.isStarted && !runner.isFinished && !runner.isPaused && runner.startTime) {
                    // Calculate current running time
                    var startTime = new Date(runner.startTime).getTime();
                    var now = new Date().getTime();
                    var pausedTime = runner.totalPausedTime || 0;
                    times[runner.id] = now - startTime - pausedTime;
                }
                else if (runner.totalRunningTime) {
                    // Use stored running time for finished or paused runners
                    times[runner.id] = runner.totalRunningTime;
                }
            });
            setRunningTimes(times);
        }, 1000);
    };
    var handleDeleteClick = function (runner) {
        setRunnerToDelete(runner);
        setShowDeleteModal(true);
    };
    var confirmDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!runnerToDelete)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, RunnerService.delete(runnerToDelete.id)];
                case 2:
                    _a.sent();
                    setRunners(runners.filter(function (r) { return r.id !== runnerToDelete.id; }));
                    setShowDeleteModal(false);
                    setRunnerToDelete(null);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setError('Failed to delete runner');
                    console.error(err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var cancelDelete = function () {
        setShowDeleteModal(false);
        setRunnerToDelete(null);
    };
    // Generic action confirmation setup
    var confirmAction = function (runner, title, message, confirmText, confirmButtonClass, action) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setActionModalData({
                title: title,
                message: message,
                confirmText: confirmText,
                confirmButtonClass: confirmButtonClass,
                onConfirm: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var updatedRunner_1, err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, action(runner.id)];
                            case 1:
                                updatedRunner_1 = _a.sent();
                                setRunners(runners.map(function (r) { return r.id === runner.id ? updatedRunner_1 : r; }));
                                setShowActionModal(false);
                                return [3 /*break*/, 3];
                            case 2:
                                err_3 = _a.sent();
                                setError("Failed to ".concat(confirmText.toLowerCase(), " runner"));
                                console.error(err_3);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }
            });
            setShowActionModal(true);
            return [2 /*return*/];
        });
    }); };
    var handleStartRunner = function (runner) {
        confirmAction(runner, 'Start Runner', "Are you sure you want to start ".concat(runner.firstName, " ").concat(runner.lastName, "?"), 'Start', 'btn-success', RunnerService.startRunner);
    };
    var handlePauseRunner = function (runner) {
        confirmAction(runner, 'Pause Runner', "Are you sure you want to pause ".concat(runner.firstName, " ").concat(runner.lastName, "?"), 'Pause', 'btn-primary', RunnerService.pauseRunner);
    };
    var handleResumeRunner = function (runner) {
        confirmAction(runner, 'Resume Runner', "Are you sure you want to resume ".concat(runner.firstName, " ").concat(runner.lastName, "?"), 'Resume', 'btn-success', RunnerService.resumeRunner);
    };
    var handleFinishRunner = function (runner) {
        confirmAction(runner, 'Finish Runner', "Are you sure you want to mark ".concat(runner.firstName, " ").concat(runner.lastName, " as finished?"), 'Finish', 'btn-danger', RunnerService.finishRunner);
    };
    var handleLogLap = function (runner) {
        confirmAction(runner, 'Log Lap', "Are you sure you want to log a lap for ".concat(runner.firstName, " ").concat(runner.lastName, "?"), 'Log Lap', 'btn-primary', RunnerService.logLap);
    };
    var handlePrintDiploma = function (runner) {
        // Find the category of the runner
        var category = categories.find(function (c) { var _a; return c.id === ((_a = runner.category) === null || _a === void 0 ? void 0 : _a.id); });
        if (!category) {
            setError('Could not find category for runner');
            return;
        }
        // Find the position of the runner in the results
        var runnersInCategory = runners.filter(function (r) { var _a; return ((_a = r.category) === null || _a === void 0 ? void 0 : _a.id) === category.id; });
        var sortedRunners = __spreadArray([], runnersInCategory, true).sort(function (a, b) { return b.totalLaps - a.totalLaps || b.totalDistance - a.totalDistance; });
        var position = sortedRunners.findIndex(function (r) { return r.id === runner.id; }) + 1;
        // Open diploma modal
        setDiplomaData({
            runner: runner,
            category: category,
            position: position
        });
        setShowDiplomaModal(true);
    };
    // Helper function to get status badge
    var getStatusBadge = function (runner) {
        if (!runner.isStarted) {
            return React.createElement("span", { className: "badge badge-warning" }, "Not Started");
        }
        else if (runner.isFinished) {
            return React.createElement("span", { className: "badge badge-success" }, "Finished");
        }
        else if (runner.isPaused) {
            return React.createElement("span", { className: "badge badge-warning" }, "Paused");
        }
        else {
            return React.createElement("span", { className: "badge badge-primary" }, "Running");
        }
    };
    // Helper function to get running time display
    var getRunningTimeDisplay = function (runner) {
        if (!runner.isStarted) {
            return '00:00:00';
        }
        var time = 0;
        if (runner.isFinished) {
            time = runner.totalRunningTime || 0;
        }
        else if (runner.isPaused) {
            time = runner.totalRunningTime || 0;
        }
        else {
            time = runningTimes[runner.id] || 0;
        }
        return RunnerService.formatRunningTime(time);
    };
    var filteredRunners = selectedCategory === 'all'
        ? runners
        : runners.filter(function (runner) { var _a; return ((_a = runner.category) === null || _a === void 0 ? void 0 : _a.id) === selectedCategory; });
    if (loading) {
        return React.createElement("div", { className: "loading" });
    }
    return (React.createElement("div", { className: "runners-page" },
        React.createElement("div", { className: "actions-bar" },
            React.createElement("h1", { className: "page-title" }, "Runners"),
            React.createElement(Link, { to: "/admin/runners/new", className: "btn" }, "Add Runner")),
        error && React.createElement("div", { className: "alert alert-danger" }, error),
        React.createElement("div", { className: "filters" },
            React.createElement("label", { htmlFor: "category-filter" }, "Filter by Category:"),
            React.createElement("select", { id: "category-filter", value: selectedCategory.toString(), onChange: function (e) { return setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value)); } },
                React.createElement("option", { value: "all" }, "All Categories"),
                categories.map(function (category) { return (React.createElement("option", { key: category.id, value: category.id }, category.name)); }))),
        filteredRunners.length === 0 ? (React.createElement("div", { className: "empty-state" },
            React.createElement("p", null, "No runners found. Add your first runner!"),
            React.createElement(Link, { to: "/admin/runners/new", className: "btn" }, "Add Runner"))) : (React.createElement("div", { className: "runners-list" },
            React.createElement("table", null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Number"),
                        React.createElement("th", null, "Name"),
                        React.createElement("th", null, "Category"),
                        React.createElement("th", null, "Status"),
                        React.createElement("th", null, "Laps"),
                        React.createElement("th", null, "Distance"),
                        React.createElement("th", null, "Actions"))),
                React.createElement("tbody", null, filteredRunners.map(function (runner) {
                    var _a;
                    return (React.createElement("tr", { key: runner.id, className: runner.isFinished
                            ? 'finished-runner'
                            : runner.isPaused
                                ? 'paused-runner'
                                : runner.isStarted
                                    ? 'active-runner'
                                    : '' },
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
                        React.createElement("td", null, getStatusBadge(runner)),
                        React.createElement("td", null, runner.totalLaps),
                        React.createElement("td", null,
                            runner.totalDistance,
                            " km",
                            React.createElement("div", { className: "running-time" }, getRunningTimeDisplay(runner))),
                        React.createElement("td", { className: "actions" },
                            React.createElement("div", { className: "action-buttons" },
                                React.createElement(Link, { to: "/admin/runners/edit/".concat(runner.id), className: "btn-edit" }, "Edit"),
                                React.createElement("button", { onClick: function () { return handleDeleteClick(runner); }, className: "btn-delete", disabled: runner.isStarted && !runner.isFinished }, "Delete")),
                            React.createElement("div", { className: "race-actions" },
                                !runner.isStarted && (React.createElement("button", { onClick: function () { return handleStartRunner(runner); }, className: "btn-start" }, "Start")),
                                runner.isStarted && !runner.isPaused && !runner.isFinished && (React.createElement(React.Fragment, null,
                                    React.createElement("button", { onClick: function () { return handleLogLap(runner); }, className: "btn-lap" }, "Log Lap"),
                                    React.createElement("button", { onClick: function () { return handlePauseRunner(runner); }, className: "btn-pause" }, "Pause"),
                                    React.createElement("button", { onClick: function () { return handleFinishRunner(runner); }, className: "btn-finish" }, "Finish"))),
                                runner.isPaused && !runner.isFinished && (React.createElement(React.Fragment, null,
                                    React.createElement("button", { onClick: function () { return handleResumeRunner(runner); }, className: "btn-resume" }, "Resume"),
                                    React.createElement("button", { onClick: function () { return handleFinishRunner(runner); }, className: "btn-finish" }, "Finish"))),
                                runner.isFinished && (React.createElement("button", { onClick: function () { return handlePrintDiploma(runner); }, className: "btn-diploma" }, "Print Diploma"))))));
                }))))),
        showDeleteModal && runnerToDelete && (React.createElement(ConfirmationModal, { isOpen: showDeleteModal, title: "Confirm Delete", message: "Are you sure you want to delete the runner \"".concat(runnerToDelete.firstName, " ").concat(runnerToDelete.lastName, "\"?"), confirmText: "Delete", cancelText: "Cancel", confirmButtonClass: "btn-danger", onConfirm: confirmDelete, onCancel: cancelDelete })),
        showActionModal && actionModalData && (React.createElement(ConfirmationModal, { isOpen: showActionModal, title: actionModalData.title, message: actionModalData.message, confirmText: actionModalData.confirmText, cancelText: "Cancel", confirmButtonClass: actionModalData.confirmButtonClass, onConfirm: actionModalData.onConfirm, onCancel: function () { return setShowActionModal(false); } })),
        showDiplomaModal && diplomaData && (React.createElement(RunnerDiploma, { runner: diplomaData.runner, category: diplomaData.category, position: diplomaData.position, onClose: function () { return setShowDiplomaModal(false); }, config: {
                eventName: "Race Runner Event",
                eventDate: new Date().toLocaleDateString(),
                eventLocation: "Race Event Location"
            } }))));
};
export default Runners;
