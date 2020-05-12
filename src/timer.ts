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

        constructor(config: TimerNodeProperties) {
            super(RED);
            let timerRunning: boolean;
            let timeoutID: NodeJS.Timeout;
            let enabled: boolean = true;
            const trigger = RED.util.evaluateNodeProperty(config.trigger, config.triggerType, this);
            const outputOnValue = RED.util.evaluateNodeProperty(config.outputOn, config.outputOnType, this);
            const outputOffValue = RED.util.evaluateNodeProperty(config.outputOff, config.outputOffType, this);

            const outputOn = () => {
                this.debug(`outputOn: ${config.name}`);
                timerRunning = true;
                this.status({ fill: "green", shape: "dot", text: "on" });
                this.send({ payload: outputOnValue });
            };
            const outputOff = () => {
                this.debug(`outputOff: ${config.name}`);
                timerRunning = false;
                this.status({ fill: "green", shape: "ring", text: "off" });
                this.send({ payload: outputOffValue });
            };
            const enable = () => {
                enabled = true;
                if (timerRunning) {
                    this.status({ fill: "green", shape: "dot", text: "on" });
                } else {
                    this.status({ fill: "green", shape: "ring", text: "off" });
                }
            };
            const disable = () => {
                enabled = false;
                this.status({ fill: "grey", shape: "ring", text: "disabled" });
            };
            this.createNode(config);
            outputOff();

            this.on("input", function (msg: any) {
                if (msg.payload && msg.payload.command) {

                    switch (msg.payload.command) {
                        case "ENABLE":
                            enable();
                            break;
                        case "DISABLE":
                            disable();
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
                        if (enabled) {
                            if (timerRunning) {
                                // reset timer
                                clearTimeout(timeoutID);
                            } else {
                                outputOn();
                            }
                            timeoutID = setTimeout(outputOff, config.timeout);
                        }
                    }
                }
            });
        }
    }
    TimerNode.registerType(RED, "timer");
};
