/**
 * Created by Julian on 4/4/2015.
 */
"use strict";
var Utils = require('./utils.js');
var KeyboardController = require('./keyboardController.js');
var AnalogStick = require('./AnalogStick.js');

var listener = -1;

function DPad(domid, options) {
    var CLICK_INTERVAL_IN_MS = 500;
    var INTERVAL_SPEED = 125;
    var self = this;
    var lastTimePressedMs = 0;
    var firstClick = true;
    var keyPressCheck = null;
    var iskeydown = false;
    var currentKey = -1;

    AnalogStick.call(this, domid,options);
    if ("WASDEvents" in options && options["WASDEvents"]){
        if (listener !== -1) {
            clearInterval(listener);
        }

        if (Utils.isTouchDevice()) {
            this.onClick = function () {
                var now = new Date().getTime();
                if (firstClick) {
                    lastTimePressedMs = now;
                    firstClick = false;
                    switch (self.getDirection()){
                        case DPad.UP:
                            if (self.onUp !== null) self.onUp.call(self);
                            break;
                        case DPad.DOWN:
                            if (self.onDown !== null) self.onDown.call(self);
                            break;
                        case DPad.LEFT:
                            if (self.onLeft !== null) self.onLeft.call(self);
                            break;
                        case DPad.RIGHT:
                            if (self.onRight !== null) self.onRight.call(self);
                            break;
                    }
                } else {
                    if ((now - lastTimePressedMs) > CLICK_INTERVAL_IN_MS) {
                        lastTimePressedMs = now;
                        switch (self.getDirection()){
                            case DPad.UP:
                                if (self.onUp !== null) self.onUp.call(self);
                                break;
                            case DPad.DOWN:
                                if (self.onDown !== null) self.onDown.call(self);
                                break;
                            case DPad.LEFT:
                                if (self.onLeft !== null) self.onLeft.call(self);
                                break;
                            case DPad.RIGHT:
                                if (self.onRight !== null) self.onRight.call(self);
                                break;
                        }
                    }
                }
            };

            this.onRelease = function(){
                firstClick = true;
            };

            keyPressCheck = function() {
                if (self.isPressed()) {
                    var now = new Date().getTime();
                    if ((now - lastTimePressedMs) > CLICK_INTERVAL_IN_MS) {
                        lastTimePressedMs = now;
                        switch (self.getDirection()) {
                            case DPad.UP:
                                if (self.onUp !== null) self.onUp.call(self);
                                break;
                            case DPad.DOWN:
                                if (self.onDown !== null) self.onDown.call(self);
                                break;
                            case DPad.LEFT:
                                if (self.onLeft !== null) self.onLeft.call(self);
                                break;
                            case DPad.RIGHT:
                                if (self.onRight !== null) self.onRight.call(self);
                                break;
                        }
                    }
                }
            };
        } else {
            // NOT TOUCH DEVICE
            var keyPressed = {
                "87": false,
                "65": false,
                "68": false,
                "83": false
            };
            document.onkeydown = function(e){
                var keyCode = e.keyCode;
                if (keyCode === 87 || keyCode === 65 || keyCode === 68 || keyCode === 83) {
                    currentKey = keyCode;
                    keyPressed[""+keyCode] = true;
                    self.keyDirection = currentKey;
                    iskeydown = true;
                    var now = new Date().getTime();
                    if (firstClick) {
                        lastTimePressedMs = now;
                        firstClick = false;
                        switch (keyCode){
                            case DPad.UP:
                                if (self.onUp !== null) self.onUp.call(self);
                                break;
                            case DPad.DOWN:
                                if (self.onDown !== null) self.onDown.call(self);
                                break;
                            case DPad.LEFT:
                                if (self.onLeft !== null) self.onLeft.call(self);
                                break;
                            case DPad.RIGHT:
                                if (self.onRight !== null) self.onRight.call(self);
                                break;
                        }
                    } else {
                        if ((now - lastTimePressedMs) > CLICK_INTERVAL_IN_MS) {
                            lastTimePressedMs = now;
                            switch (keyCode){
                                case DPad.UP:
                                    if (self.onUp !== null) self.onUp.call(self);
                                    break;
                                case DPad.DOWN:
                                    if (self.onDown !== null) self.onDown.call(self);
                                    break;
                                case DPad.LEFT:
                                    if (self.onLeft !== null) self.onLeft.call(self);
                                    break;
                                case DPad.RIGHT:
                                    if (self.onRight !== null) self.onRight.call(self);
                                    break;
                            }
                        }
                    }
                }
            };
            KeyboardController.onWASDUp(domid, function (keyCode) {
                if (keyCode === 87 || keyCode === 65 || keyCode === 68 || keyCode === 83) {
                    keyPressed[""+keyCode] = false;
                    if (!keyPressed["87"] && !keyPressed["65"] && !keyPressed["68"] && !keyPressed["83"]){
                        self.keyDirection = DPad.NONE;
                        iskeydown = false;
                        firstClick = true;
                    }
                }
            });
            keyPressCheck = function() {
                if (iskeydown) {
                    var now = new Date().getTime();
                    if ((now - lastTimePressedMs) > CLICK_INTERVAL_IN_MS) {
                        lastTimePressedMs = now;
                        switch (currentKey){
                            case DPad.UP:
                                if (self.onUp !== null) self.onUp.call(self);
                                break;
                            case DPad.DOWN:
                                if (self.onDown !== null) self.onDown.call(self);
                                break;
                            case DPad.LEFT:
                                if (self.onLeft !== null) self.onLeft.call(self);
                                break;
                            case DPad.RIGHT:
                                if (self.onRight !== null) self.onRight.call(self);
                                break;
                        }
                    }
                }
            };
        }

        listener = setInterval(keyPressCheck, INTERVAL_SPEED);

        this.onUp = null;
        this.onDown = null;
        this.onLeft = null;
        this.onRight = null;
    }
    this.keyDirection = DPad.NONE;
}

DPad.prototype = Object.create(AnalogStick.prototype);

DPad.UP = 87;
DPad.DOWN = 83;
DPad.LEFT = 65;
DPad.RIGHT = 68;
DPad.NONE = -1;

if (Utils.isTouchDevice()) {
    DPad.prototype.getDirection = function(){
        if (this.isPressed()) {
            var deg = this.getDegree();
            if (deg < 45 || deg >= 315){
                return DPad.LEFT;
            } else if (deg < 315 && deg >= 225) {
                return DPad.UP;
            } else if (deg < 225 && deg >= 135) {
                return DPad.RIGHT;
            } else {
                return DPad.DOWN;
            }
        } else {
            return DPad.NONE;
        }
    };
} else {
    DPad.prototype.getDirection = function(){
        return this.keyDirection;
    };
}

module.exports = DPad;