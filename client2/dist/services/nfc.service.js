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
import api from './api';
export var NfcEventType;
(function (NfcEventType) {
    NfcEventType["SCAN"] = "scan";
    NfcEventType["TAG_REGISTERED"] = "tag_registered";
    NfcEventType["TAG_ASSIGNED"] = "tag_assigned";
    NfcEventType["TAG_UNASSIGNED"] = "tag_unassigned";
    NfcEventType["RUNNER_STARTED"] = "runner_started";
    NfcEventType["LAP_LOGGED"] = "lap_logged";
    NfcEventType["SCAN_THROTTLED"] = "scan_throttled";
    NfcEventType["ERROR"] = "error";
})(NfcEventType || (NfcEventType = {}));
var NfcService = /** @class */ (function () {
    function NfcService() {
        this.baseUrl = '/nfc';
    }
    /**
     * Get all unassigned NFC tags
     */
    NfcService.prototype.getUnassignedTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get("".concat(this.baseUrl, "/unassigned-tags"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Assign an NFC tag to a runner
     */
    NfcService.prototype.assignTagToRunner = function (tagId, runnerId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.post("".concat(this.baseUrl, "/assign-tag"), {
                            tagId: tagId,
                            runnerId: runnerId
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Unassign an NFC tag from a runner
     */
    NfcService.prototype.unassignTagFromRunner = function (runnerId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.post("".concat(this.baseUrl, "/unassign-tag"), {
                            runnerId: runnerId
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Process a tag scan (this would be called from the Arduino device)
     * This is included here for testing purposes
     */
    NfcService.prototype.processTag = function (tagId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.post("".concat(this.baseUrl, "/process-tag"), {
                            tagId: tagId
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Check if a tag ID is in a valid format
     */
    NfcService.prototype.isValidTagId = function (tagId) {
        // NFC tag IDs are typically hexadecimal strings
        // Adjust this validation as needed for your specific format
        return /^[A-Fa-f0-9]{4,32}$/.test(tagId);
    };
    /**
     * Format a tag ID for display (e.g., add colons between bytes)
     */
    NfcService.prototype.formatTagId = function (tagId) {
        // If the tag ID is not valid, return it as is
        if (!this.isValidTagId(tagId)) {
            return tagId;
        }
        // Add colons every 2 characters for readability
        var parts = [];
        for (var i = 0; i < tagId.length; i += 2) {
            parts.push(tagId.substring(i, i + 2));
        }
        return parts.join(':').toUpperCase();
    };
    /**
     * Get NFC log history with optional limit
     */
    NfcService.prototype.getNfcLogs = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var response;
            if (limit === void 0) { limit = 100; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get("".concat(this.baseUrl, "/logs"), {
                            params: { limit: limit }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Get the display text for an NFC event type
     */
    NfcService.prototype.getEventTypeDisplay = function (eventType) {
        var _a;
        var displayMap = (_a = {},
            _a[NfcEventType.SCAN] = 'Tag Scan',
            _a[NfcEventType.TAG_REGISTERED] = 'Tag Registered',
            _a[NfcEventType.TAG_ASSIGNED] = 'Tag Assigned',
            _a[NfcEventType.TAG_UNASSIGNED] = 'Tag Unassigned',
            _a[NfcEventType.RUNNER_STARTED] = 'Runner Started',
            _a[NfcEventType.LAP_LOGGED] = 'Lap Logged',
            _a[NfcEventType.SCAN_THROTTLED] = 'Scan Throttled',
            _a[NfcEventType.ERROR] = 'Error',
            _a);
        return displayMap[eventType] || eventType;
    };
    return NfcService;
}());
export default new NfcService();
