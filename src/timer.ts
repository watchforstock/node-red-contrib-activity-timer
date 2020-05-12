import { Red, NodeProperties } from "node-red";
import { Node } from "node-red-contrib-typescript-node";

interface TimerNodeProperties extends NodeProperties {
    outputOn: any;
    outputOnType: any;
    outputOff: any;
    outputOffType: any;
    triggerValue: any;
    trigger: any;
    triggerType: any;
    timeout: number;
}

module.exports = function (RED: Red) {
    class TimerNode extends Node {
        private timerRunning: boolean;
        private timeoutID: NodeJS.Timeout;
        private enabled: boolean;
        private outputOnValue: any;
        private outputOffValue: any;

        constructor(config: TimerNodeProperties) {
            super(RED);
            this.createNode(config);
            this.outputOff();
            const trigger = RED.util.evaluateNodeProperty(config.trigger, config.triggerType, this);
            this.outputOnValue = RED.util.evaluateNodeProperty(config.outputOn, config.outputOnType, this);
            this.outputOffValue = RED.util.evaluateNodeProperty(config.outputOff, config.outputOffType, this);
            this.enabled = true;
            const obj = this;

            this.on("input", function (msg: any) {
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
                } else {
                    if (msg.payload === trigger) {
                        if (obj.enabled) {
                            if (obj.timerRunning) {
                                // reset timer
                                clearTimeout(obj.timeoutID);
                            } else {
                                this.outputOn();
                            }
                            obj.timeoutID = setTimeout(this.outputOff, config.timeout);
                        }
                    }
                }
            });
        }

        outputOn = () => {
            this.timerRunning = true;
            this.status({ fill: "green", shape: "dot", text: "on" });
            this.send({ payload: this.outputOnValue });
        }
        outputOff = () => {
            this.timerRunning = false;
            this.status({ fill: "green", shape: "ring", text: "off" });
            this.send({ payload: this.outputOffValue });
        }
        enable = () => {
            this.enabled = true;
            this.status({ fill: "green", shape: "ring", text: "off" });
        }
        disable = () => {
            this.enabled = false;
            this.status({ fill: "grey", shape: "ring", text: "disabled" });
        }
        forceOn = () => {

        }
        forceOff = () => {

        }
        reset = () => {

        }
    }
    TimerNode.registerType(RED, "timer");
};
