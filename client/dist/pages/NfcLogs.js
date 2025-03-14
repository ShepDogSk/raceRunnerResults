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
import { Table, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import nfcService, { NfcEventType } from '../services/nfc.service';
import './NfcLogs.css';
var NfcLogs = function () {
    var _a = useState([]), logs = _a[0], setLogs = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    useEffect(function () {
        var fetchLogs = function () { return __awaiter(void 0, void 0, void 0, function () {
            var logData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, nfcService.getNfcLogs(200)];
                    case 1:
                        logData = _a.sent();
                        setLogs(logData);
                        setError(null);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Failed to fetch NFC logs:', err_1);
                        setError('Failed to load NFC logs. Please try again later.');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchLogs();
        // Set up a refresh interval every 30 seconds
        var intervalId = setInterval(fetchLogs, 30000);
        // Clean up interval on component unmount
        return function () { return clearInterval(intervalId); };
    }, []);
    var getBadgeVariant = function (eventType) {
        switch (eventType) {
            case NfcEventType.LAP_LOGGED:
                return 'success';
            case NfcEventType.RUNNER_STARTED:
                return 'primary';
            case NfcEventType.ERROR:
                return 'danger';
            case NfcEventType.SCAN_THROTTLED:
                return 'warning';
            case NfcEventType.TAG_REGISTERED:
                return 'info';
            case NfcEventType.TAG_ASSIGNED:
                return 'secondary';
            case NfcEventType.TAG_UNASSIGNED:
                return 'secondary';
            case NfcEventType.SCAN:
            default:
                return 'light';
        }
    };
    var formatTimestamp = function (timestamp) {
        // Get date object from string or date
        var date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        return format(date, 'HH:mm:ss dd/MM/yyyy');
    };
    if (loading && logs.length === 0) {
        return (React.createElement(Container, { className: "mt-4" },
            React.createElement("div", { className: "text-center" },
                React.createElement(Spinner, { animation: "border", role: "status" },
                    React.createElement("span", { className: "visually-hidden" }, "Loading...")),
                React.createElement("p", null, "Loading NFC logs..."))));
    }
    return (React.createElement(Container, { className: "mt-4 nfc-logs-container" },
        React.createElement(Row, null,
            React.createElement(Col, null,
                React.createElement("h2", null, "NFC Activity Logs"),
                React.createElement("p", null, "Monitoring NFC tag scans and events"),
                error && React.createElement("div", { className: "alert alert-danger" }, error))),
        React.createElement(Row, null,
            React.createElement(Col, null,
                React.createElement("div", { className: "table-responsive" },
                    React.createElement(Table, { striped: true, bordered: true, hover: true, className: "nfc-logs-table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Time"),
                                React.createElement("th", null, "Event"),
                                React.createElement("th", null, "Tag ID"),
                                React.createElement("th", null, "Runner"),
                                React.createElement("th", null, "Details"),
                                React.createElement("th", null, "Lap"))),
                        React.createElement("tbody", null, logs.length === 0 ? (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 6, className: "text-center" }, "No NFC logs found"))) : (logs.map(function (log) { return (React.createElement("tr", { key: log.id, className: log.eventType === NfcEventType.ERROR ? 'table-danger' : '' },
                            React.createElement("td", null, formatTimestamp(log.timestamp)),
                            React.createElement("td", null,
                                React.createElement(Badge, { bg: getBadgeVariant(log.eventType) }, nfcService.getEventTypeDisplay(log.eventType)),
                                log.isThrottled && (React.createElement(Badge, { bg: "warning", className: "ms-1" }, "Throttled"))),
                            React.createElement("td", null, log.tagId ? (React.createElement("div", null,
                                React.createElement("code", null, nfcService.formatTagId(log.tagId)),
                                log.tag && (React.createElement("div", { className: "tag-details" },
                                    React.createElement("small", { className: "text-muted d-block" },
                                        React.createElement("span", { title: "Tag Status" },
                                            React.createElement(Badge, { bg: log.tag.isActive ? "success" : "secondary", className: "me-1" }, log.tag.isActive ? "Active" : "Inactive"))),
                                    React.createElement("small", { className: "text-muted d-block" },
                                        React.createElement("span", { title: "First Seen" },
                                            "First seen: ",
                                            format(new Date(log.tag.firstSeen), 'dd/MM/yyyy'))),
                                    log.tag.lastAssigned && (React.createElement("small", { className: "text-muted d-block" },
                                        React.createElement("span", { title: "Last Assigned" },
                                            "Assigned: ",
                                            format(new Date(log.tag.lastAssigned), 'dd/MM/yyyy')))))))) : (React.createElement("span", { className: "text-muted" }, "N/A"))),
                            React.createElement("td", null, log.runner ? (React.createElement("div", null,
                                React.createElement("div", null,
                                    React.createElement("strong", null,
                                        "#",
                                        log.runner.runnerNumber)),
                                React.createElement("div", null,
                                    log.runner.firstName,
                                    " ",
                                    log.runner.lastName))) : (React.createElement("span", { className: "text-muted" }, "Unassigned"))),
                            React.createElement("td", null, log.details || log.errorMessage || React.createElement("span", { className: "text-muted" }, "-")),
                            React.createElement("td", null, log.lapNumber !== undefined && log.lapNumber !== null ? (React.createElement(Badge, { bg: "success" }, log.lapNumber)) : (React.createElement("span", { className: "text-muted" }, "-"))))); })))))))));
};
export default NfcLogs;
