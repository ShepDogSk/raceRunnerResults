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
import DiplomaGenerator from '../services/pdfGenerator';
import './RunnerDiploma.css';
var RunnerDiploma = function (_a) {
    var runner = _a.runner, category = _a.category, position = _a.position, onClose = _a.onClose, _b = _a.config, config = _b === void 0 ? {} : _b;
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), pdfUrl = _d[0], setPdfUrl = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    useEffect(function () {
        var generateDiploma = function () { return __awaiter(void 0, void 0, void 0, function () {
            var pdfBlob, url, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, DiplomaGenerator.generateDiploma(runner, category, position, config)];
                    case 1:
                        pdfBlob = _a.sent();
                        url = URL.createObjectURL(pdfBlob);
                        setPdfUrl(url);
                        setError(null);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Error generating diploma:', err_1);
                        setError('Failed to generate diploma. Please try again.');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        generateDiploma();
        // Cleanup function to revoke object URL when component unmounts
        return function () {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [runner, category, position, config]);
    return (React.createElement("div", { className: "diploma-modal-overlay", onClick: onClose },
        React.createElement("div", { className: "diploma-modal", onClick: function (e) { return e.stopPropagation(); } },
            React.createElement("div", { className: "diploma-header" },
                React.createElement("h2", null, "Runner Diploma"),
                React.createElement("button", { className: "close-button", onClick: onClose }, "\u00D7")),
            React.createElement("div", { className: "diploma-content" }, loading ? (React.createElement("div", { className: "diploma-loading" }, "Generating diploma...")) : error ? (React.createElement("div", { className: "diploma-error" }, error)) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "diploma-preview" },
                    React.createElement("iframe", { src: pdfUrl || '', title: "Diploma Preview", width: "100%", height: "500px" })),
                React.createElement("div", { className: "diploma-actions" },
                    React.createElement("a", { href: pdfUrl || '', download: "diploma_".concat(runner.firstName, "_").concat(runner.lastName, ".pdf"), className: "btn btn-primary" }, "Download PDF"),
                    React.createElement("button", { onClick: function () { return window.open(pdfUrl || '', '_blank'); }, className: "btn btn-outline" }, "Open in New Tab"),
                    React.createElement("button", { onClick: function () {
                            if (pdfUrl) {
                                var printWindow_1 = window.open(pdfUrl, '_blank');
                                if (printWindow_1) {
                                    printWindow_1.addEventListener('load', function () {
                                        printWindow_1.print();
                                    });
                                }
                            }
                        }, className: "btn btn-success" }, "Print"))))))));
};
export default RunnerDiploma;
