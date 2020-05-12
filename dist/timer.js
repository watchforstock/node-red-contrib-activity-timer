"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var node_red_contrib_typescript_node_1 = require("node-red-contrib-typescript-node");
module.exports = function (RED) {
    var TimerNode = /** @class */ (function (_super) {
        __extends(TimerNode, _super);
        function TimerNode(config) {
            var _this = _super.call(this, RED) || this;
            _this.outputOn = function () {
                _this.timerRunning = true;
                _this.status({ fill: "green", shape: "dot", text: "on" });
                _this.send({ payload: _this.outputOnValue });
            };
            _this.outputOff = function () {
                _this.timerRunning = false;
                _this.status({ fill: "green", shape: "ring", text: "off" });
                _this.send({ payload: _this.outputOffValue });
            };
            _this.enable = function () {
                _this.enabled = true;
                _this.status({ fill: "green", shape: "ring", text: "off" });
            };
            _this.disable = function () {
                _this.enabled = false;
                _this.status({ fill: "grey", shape: "ring", text: "disabled" });
            };
            _this.forceOn = function () {
            };
            _this.forceOff = function () {
            };
            _this.reset = function () {
            };
            _this.createNode(config);
            _this.outputOff();
            var trigger = RED.util.evaluateNodeProperty(config.trigger, config.triggerType, _this);
            _this.outputOnValue = RED.util.evaluateNodeProperty(config.outputOn, config.outputOnType, _this);
            _this.outputOffValue = RED.util.evaluateNodeProperty(config.outputOff, config.outputOffType, _this);
            _this.enabled = true;
            var obj = _this;
            _this.on("input", function (msg) {
                if (msg.payload && msg.payload.command) {
                    switch (msg.payload.command) {
                        case "ENABLE":
                            this.enable();
                            break;
                        case "DISABLE":
                            this.disable();
                            break;
                        case "FORCEON":
                            break;
                        case "FORCEOFF":
                            break;
                        case "RESET":
                            break;
                    }
                }
                else {
                    if (msg.payload === trigger) {
                        if (obj.enabled) {
                            if (obj.timerRunning) {
                                // reset timer
                                clearTimeout(obj.timeoutID);
                            }
                            else {
                                this.outputOn();
                            }
                            obj.timeoutID = setTimeout(this.outputOff, config.timeout);
                        }
                    }
                }
            });
            return _this;
        }
        return TimerNode;
    }(node_red_contrib_typescript_node_1.Node));
    TimerNode.registerType(RED, "timer");
};
//# sourceMappingURL=timer.js.map