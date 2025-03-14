import { io } from 'socket.io-client';
/**
 * Socket service for real-time updates
 * This service connects to the WebSocket server and handles the events emitted by the server
 */
var SocketService = /** @class */ (function () {
    function SocketService() {
        this.socket = null;
        this.listeners = {};
        this.connected = false;
    }
    /**
     * Initialize socket connection
     */
    SocketService.prototype.init = function () {
        var _this = this;
        if (this.socket) {
            return; // Already initialized
        }
        // Connect to the WebSocket server
        // Use the same host/port as the API, but with WebSocket protocol
        var protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        var host = window.location.host;
        var url = "".concat(protocol, "://").concat(host);
        this.socket = io(url);
        // Setup connection events
        this.socket.on('connect', function () {
            console.log('Socket connected!');
            _this.connected = true;
        });
        this.socket.on('disconnect', function () {
            console.log('Socket disconnected!');
            _this.connected = false;
        });
        this.socket.on('connect_error', function (error) {
            console.error('Socket connection error:', error);
            _this.connected = false;
        });
        // Setup event listeners for race-related events
        this.setupRaceEventListeners();
    };
    /**
     * Setup event listeners for race-related events
     */
    SocketService.prototype.setupRaceEventListeners = function () {
        var _this = this;
        if (!this.socket)
            return;
        // Runner events
        this.socket.on('runner.updated', function (runner) {
            _this.emitEvent('runner.updated', runner);
        });
        this.socket.on('runner.started', function (runner) {
            _this.emitEvent('runner.started', runner);
        });
        this.socket.on('runner.paused', function (runner) {
            _this.emitEvent('runner.paused', runner);
        });
        this.socket.on('runner.resumed', function (runner) {
            _this.emitEvent('runner.resumed', runner);
        });
        this.socket.on('runner.finished', function (runner) {
            _this.emitEvent('runner.finished', runner);
        });
        // Lap events
        this.socket.on('lap.created', function (lap) {
            _this.emitEvent('lap.created', lap);
        });
        // Results events
        this.socket.on('results.updated', function (data) {
            _this.emitEvent('results.updated', data);
        });
        this.socket.on('results.updated.category', function (data) {
            _this.emitEvent('results.updated.category', data);
        });
    };
    /**
     * Subscribe to an event
     * @param eventName Name of the event to subscribe to
     * @param callback Callback to execute when the event is triggered
     * @returns Function to unsubscribe
     */
    SocketService.prototype.subscribe = function (eventName, callback) {
        var _this = this;
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
        // Return unsubscribe function
        return function () {
            if (!_this.listeners[eventName])
                return;
            _this.listeners[eventName] = _this.listeners[eventName].filter(function (cb) { return cb !== callback; });
        };
    };
    /**
     * Emit event to all subscribers
     * @param eventName Name of the event
     * @param data Data to send with the event
     */
    SocketService.prototype.emitEvent = function (eventName, data) {
        if (!this.listeners[eventName])
            return;
        this.listeners[eventName].forEach(function (callback) {
            try {
                callback(data);
            }
            catch (error) {
                console.error("Error in socket event handler for \"".concat(eventName, "\":"), error);
            }
        });
    };
    /**
     * Check if socket is connected
     */
    SocketService.prototype.isConnected = function () {
        return this.connected;
    };
    /**
     * Disconnect socket
     */
    SocketService.prototype.disconnect = function () {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    };
    return SocketService;
}());
// Export singleton instance
export default new SocketService();
