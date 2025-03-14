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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import jsPDF from 'jspdf';
// Default configuration for diploma generation
var defaultDiplomaConfig = {
    eventName: 'Running Event',
    eventDate: new Date().toLocaleDateString(),
    eventLocation: 'Event Location',
    primaryColor: '#0066cc',
    secondaryColor: '#28a745'
};
export var DiplomaGenerator = {
    /**
     * Generate a PDF diploma for a runner
     * @param runner The runner to generate the diploma for
     * @param category The runner's category
     * @param position The runner's position in the results
     * @param config Optional configuration for the diploma
     * @returns The generated PDF as a Blob
     */
    generateDiploma: function (runner_1, category_1, position_1) {
        var args_1 = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args_1[_i - 3] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([runner_1, category_1, position_1], args_1, true), void 0, function (runner, category, position, config) {
            var diplomaConfig, pdf, totalTime;
            if (config === void 0) { config = {}; }
            return __generator(this, function (_a) {
                diplomaConfig = __assign(__assign({}, defaultDiplomaConfig), config);
                pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                });
                // Set background color
                pdf.setFillColor(250, 250, 250);
                pdf.rect(0, 0, 297, 210, 'F');
                // Add border
                pdf.setDrawColor(diplomaConfig.primaryColor || '#0066cc');
                pdf.setLineWidth(3);
                pdf.rect(10, 10, 277, 190);
                // Add header
                pdf.setFontSize(30);
                pdf.setTextColor(diplomaConfig.primaryColor || '#0066cc');
                pdf.setFont('helvetica', 'bold');
                pdf.text('DIPLOMA', 148.5, 40, { align: 'center' });
                // Add event details
                pdf.setFontSize(18);
                pdf.setTextColor(0, 0, 0);
                pdf.setFont('helvetica', 'normal');
                pdf.text("This certifies that", 148.5, 60, { align: 'center' });
                // Add runner name
                pdf.setFontSize(24);
                pdf.setFont('helvetica', 'bold');
                pdf.text("".concat(runner.firstName, " ").concat(runner.lastName), 148.5, 75, { align: 'center' });
                if (runner.nickname) {
                    pdf.setFontSize(18);
                    pdf.setFont('helvetica', 'italic');
                    pdf.text("\"".concat(runner.nickname, "\""), 148.5, 85, { align: 'center' });
                }
                // Add achievement
                pdf.setFontSize(18);
                pdf.setFont('helvetica', 'normal');
                pdf.text("has successfully completed the ".concat(diplomaConfig.eventName), 148.5, 100, { align: 'center' });
                // Add category and position
                pdf.setFontSize(16);
                pdf.setTextColor(diplomaConfig.secondaryColor || '#28a745');
                pdf.text("Category: ".concat(category.name), 148.5, 115, { align: 'center' });
                pdf.text("Position: ".concat(getPositionText(position)), 148.5, 125, { align: 'center' });
                // Add stats
                pdf.setFontSize(14);
                pdf.setTextColor(0, 0, 0);
                totalTime = runner.totalRunningTime
                    ? formatTime(runner.totalRunningTime)
                    : 'N/A';
                pdf.text("Total Time: ".concat(totalTime), 148.5, 140, { align: 'center' });
                pdf.text("Total Distance: ".concat(runner.totalDistance, " km"), 148.5, 150, { align: 'center' });
                pdf.text("Total Laps: ".concat(runner.totalLaps), 148.5, 160, { align: 'center' });
                // Add event details and date
                pdf.setFontSize(12);
                pdf.text("".concat(diplomaConfig.eventLocation, " - ").concat(diplomaConfig.eventDate), 148.5, 180, { align: 'center' });
                // Return the PDF as a blob
                return [2 /*return*/, pdf.output('blob')];
            });
        });
    }
};
// Helper function to format time (milliseconds to HH:MM:SS)
var formatTime = function (milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        remainingSeconds.toString().padStart(2, '0')
    ].join(':');
};
// Helper function to format position (1st, 2nd, 3rd, etc.)
var getPositionText = function (position) {
    if (position === 1)
        return '1st Place';
    if (position === 2)
        return '2nd Place';
    if (position === 3)
        return '3rd Place';
    return "".concat(position, "th Place");
};
export default DiplomaGenerator;
