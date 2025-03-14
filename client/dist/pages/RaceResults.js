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
import React, { useEffect, useState, useRef } from 'react';
import CategoryService from '../services/category.service';
import RunnerService from '../services/runner.service';
import socketService from '../services/socket.service';
import './RaceResults.css';
var RaceResults = function () {
    var _a = useState([]), categories = _a[0], setCategories = _a[1];
    var _b = useState([]), runners = _b[0], setRunners = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useState(null), selectedCategory = _e[0], setSelectedCategory = _e[1];
    var _f = useState({}), runningTimes = _f[0], setRunningTimes = _f[1];
    var timerRef = useRef(null);
    useEffect(function () {
        fetchData();
        // Set up socket subscription for real-time updates
        var unsubscribeResults = socketService.subscribe('results.updated', function () {
            console.log('Race results updated, refreshing data...');
            fetchData();
        });
        var unsubscribeCategoryResults = socketService.subscribe('results.updated.category', function (data) {
            console.log("Results updated for category ".concat(data.categoryId));
            if (selectedCategory === data.categoryId) {
                fetchData();
            }
        });
        var unsubscribeRunner = socketService.subscribe('runner.updated', function (runner) {
            var _a;
            console.log("Runner updated: ".concat(runner.id));
            if (((_a = runner.category) === null || _a === void 0 ? void 0 : _a.id) === selectedCategory) {
                fetchData();
            }
        });
        var unsubscribeLap = socketService.subscribe('lap.created', function (lap) {
            var _a, _b, _c;
            console.log("New lap logged for runner: ".concat((_a = lap.runner) === null || _a === void 0 ? void 0 : _a.id));
            if (((_c = (_b = lap.runner) === null || _b === void 0 ? void 0 : _b.category) === null || _c === void 0 ? void 0 : _c.id) === selectedCategory) {
                fetchData();
            }
        });
        return function () {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            // Clean up socket subscriptions
            unsubscribeResults();
            unsubscribeCategoryResults();
            unsubscribeRunner();
            unsubscribeLap();
        };
    }, [selectedCategory]);
    var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, categoriesData, runnersData, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, Promise.all([
                            CategoryService.getAll(),
                            RunnerService.getAll()
                        ])];
                case 1:
                    _a = _b.sent(), categoriesData = _a[0], runnersData = _a[1];
                    setCategories(categoriesData);
                    setRunners(runnersData);
                    if (categoriesData.length > 0) {
                        setSelectedCategory(categoriesData[0].id);
                    }
                    setError('');
                    // Start timer to update running times
                    startRunningTimeTimer(runnersData);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _b.sent();
                    setError('Failed to load race results');
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
    var handleCategoryChange = function (categoryId) {
        setSelectedCategory(categoryId);
    };
    var getFilteredRunners = function () {
        if (!selectedCategory)
            return [];
        return runners
            .filter(function (runner) { var _a; return ((_a = runner.category) === null || _a === void 0 ? void 0 : _a.id) === selectedCategory; })
            .sort(function (a, b) { return b.totalLaps - a.totalLaps || b.totalDistance - a.totalDistance; });
    };
    var filteredRunners = getFilteredRunners();
    if (loading) {
        return React.createElement("div", { className: "loading" });
    }
    return (React.createElement("div", { className: "race-results" },
        React.createElement("h1", { className: "page-title" }, "Race Results"),
        error && React.createElement("div", { className: "alert alert-danger" }, error),
        categories.length === 0 ? (React.createElement("div", { className: "empty-state" },
            React.createElement("p", null, "No race categories available."))) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "category-tabs" }, categories.map(function (category) { return (React.createElement("button", { key: category.id, className: "category-tab ".concat(selectedCategory === category.id ? 'active' : ''), onClick: function () { return handleCategoryChange(category.id); } }, category.name)); })),
            filteredRunners.length === 0 ? (React.createElement("div", { className: "empty-state" },
                React.createElement("p", null, "No runners in this category yet."))) : (React.createElement("div", { className: "results-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Position"),
                            React.createElement("th", null, "Number"),
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Status"),
                            React.createElement("th", null, "Laps"),
                            React.createElement("th", null, "Distance (km)"))),
                    React.createElement("tbody", null, filteredRunners.map(function (runner, index) { return (React.createElement("tr", { key: runner.id, className: runner.isStarted ? 'active-runner' : '' },
                        React.createElement("td", null, index + 1),
                        React.createElement("td", null, runner.runnerNumber),
                        React.createElement("td", null,
                            runner.firstName,
                            " ",
                            runner.lastName,
                            runner.nickname && React.createElement("span", { className: "nickname" },
                                "(",
                                runner.nickname,
                                ")")),
                        React.createElement("td", null, !runner.isStarted ? (React.createElement("span", { className: "badge badge-warning" }, "Not Started")) : runner.isFinished ? (React.createElement("span", { className: "badge badge-success" }, "Finished")) : runner.isPaused ? (React.createElement("span", { className: "badge badge-warning" }, "Paused")) : (React.createElement("span", { className: "badge badge-primary" }, "Running"))),
                        React.createElement("td", null, runner.totalLaps),
                        React.createElement("td", null,
                            runner.totalDistance,
                            " km",
                            runner.isStarted && (React.createElement("div", { className: "running-time" }, RunnerService.formatRunningTime(runner.isFinished || runner.isPaused
                                ? runner.totalRunningTime
                                : runningTimes[runner.id])))))); })))))))));
};
export default RaceResults;
