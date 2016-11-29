!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.TouchController=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Julian on 4/4/2015.
 */
"use strict";

var Utils = require('./utils');

function AnalogStick(domid, position) {

    var topTouchOffset = Utils.topTouchOffset();

    // ============ H E L P E R  F U N C T I O N S ============
    function handleStart(e) {
        self.pressed = true;
        e.preventDefault();
        self.fx = e.changedTouches[0].screenX;
        self.fy = e.changedTouches[0].screenY - topTouchOffset;
        if (self.allowOnClick && self.onClick !== null) self.onClick.call(self);
    }

    function handleEnd(e) {
        self.pressed = false;
        e.preventDefault();
        if (self.allowOnClick && self.onRelease !== null) self.onRelease.call(self);
    }

    function handleMove(e) {
        e.preventDefault();
        self.fx = e.changedTouches[0].screenX;
        self.fy = e.changedTouches[0].screenY - topTouchOffset;
        if (self.allowOnClick && self.onClick !== null) self.onClick.call(self);
    }
    // ============ H E L P E R  F U N C T I O N S ============

    this.allowOnClick = true;
    var el = document.getElementById(domid);
    var style = "";
    var self = this, id;
    var diameter = Utils.diameter();
    if (Utils.isTouchDevice()) {
        if (typeof position === 'undefined') {
            position = {};
        }
        if ("bottom" in position) {
            style += "bottom:" +position.bottom + "px;";
        } else if ("top" in position) {
            style += "top:" +position.top + "px;";
        }
        if ("left" in position){
            style += "left:" +position.left + "px;";
        } else if ("right" in position) {
            style += "right:" +position.right + "px;";
        }
        id = Utils.newId();
        el.innerHTML = '<div style="'+
            style+
            '" id="'+ id
            +'" class="touchController"><div class="innerTouchController"></div></div>';

        this.fx = -1;
        this.fy = -1;
        this.pressed = false;
        this.x = 0;
        this.y = 0;

        this.onClick = null;
        this.onRelease = null;

        el.addEventListener("touchstart", handleStart, false);
        el.addEventListener("touchend", handleEnd, false);
        el.addEventListener("touchmove", handleMove, false);
        el.addEventListener("touchcancel", handleEnd, false);

        setTimeout(function(){
            var el = document.getElementById(id);
            var o = Utils.getOffsetRect(el);
            self.x = o.left + Math.ceil(diameter/2);
            self.y = o.top + Math.ceil(diameter/2);
        },100);

    } else {
        // NON-TOUCH-DEVICE
        el.parentNode.removeChild(el);
    }
}

AnalogStick.prototype.isPressed = function(){
    return this.pressed;
};

AnalogStick.prototype.getDegree = function(){
    return Utils.getDegree(this.x, this.y, this.fx, this.fy);
};

module.exports = AnalogStick;
},{"./utils":7}],2:[function(require,module,exports){
/**
 * Created by Julian on 4/4/2015.
 */
"use strict";
var Utils = require('./utils.js');
var KeyboardController = require('./keyboardController.js');
var nextID = 0;

function Button(domid, name, options) {
    // ============ H E L P E R  F U N C T I O N S ============
    function handleStart(e) {
        document.getElementById(id).className = "touchBtn pressed";
        e.preventDefault();
    }

    function handleEnd(e) {
        if (self.onClick !== null) {
            self.onClick.call(self);
        }
        document.getElementById(id).className = "touchBtn";
        e.preventDefault();
    }

    function handleCancel(e){
        document.getElementById(id).className = "touchBtn";
        e.preventDefault();
    }
    // ============ H E L P E R  F U N C T I O N S ============

    var self = this;
    var el = document.getElementById(domid);
    var keyToButton = KeyboardController.keyToButton();
    if (Utils.isTouchDevice()) {
        var style = "";
        if (typeof options === "undefined") {
            options = {};
        }
        if ("bottom" in options){
            style += "bottom:" +options.bottom + "px;";
        } else if ("top" in options) {
            style += "top:" +options.top + "px;";
        }
        if ("left" in options){
            style += "left:" +options.left + "px;";
        } else if ("right" in options) {
            style += "right:" +options.right + "px;";
        }

        var id = "touchBtn" + nextID++;
        el.innerHTML = '<div style="'+
            style+
            '" id="'+ id
            +'" class="touchBtn"><div class="touchBtnTxt">' + name +'</div></div>';

        el.addEventListener("touchstart", handleStart, false);
        el.addEventListener("touchend", handleEnd, false);
        el.addEventListener("touchcancel", handleCancel, false);

    } else {
        // NON TOUCH DEVICE
        el.parentNode.removeChild(el);
        if ("key" in options) {
            keyToButton[options["key"]] = this;
        }
    }
    this.onClick = null;
}

module.exports = Button;
},{"./keyboardController.js":5,"./utils.js":7}],3:[function(require,module,exports){
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
},{"./AnalogStick.js":1,"./keyboardController.js":5,"./utils.js":7}],4:[function(require,module,exports){
/**
 * Created by Julian on 4/4/2015.
 */
"use strict";
module.exports = {
    SPACE : "sp",
    ENTER : "en",
    ESC : "esc",
    Q : "q",
    E : "e"
};
},{}],5:[function(require,module,exports){
/**
 * Created by Julian on 4/4/2015.
 */
"use strict";

var Utils = require('./utils.js');
var KEYS = require('./KEYS.js');

var _keyToButton = {};

function testAndExecKey(keycode, expectedKeycode, value) {
    if (expectedKeycode === keycode && value in _keyToButton) {
        var btn = _keyToButton[value];
        if (btn.onClick !== null) {
            btn.onClick.call(btn);
        }
        return true;
    }
    return false;
}

if (!Utils.isTouchDevice()) {

    document.onkeyup = function (e) {

        var keyCode = e.keyCode;

        // ignore WASD
        if (keyCode !== 87 && keyCode !== 65 &&
            keyCode !== 83 && keyCode !== 68) {
            if (!testAndExecKey(keyCode, 32, KEYS.SPACE))
                if (!testAndExecKey(keyCode, 13, KEYS.ENTER))
                    if (!testAndExecKey(keyCode, 27, KEYS.ESC))
                        if (!testAndExecKey(keyCode, 81, KEYS.Q))
                            if (!testAndExecKey(keyCode, 69, KEYS.E)) {
                            }
        } else {
            var i = 0, L = _wasdCallbacks.length;
            for (; i < L; i++) {
                _wasdCallbacks[i].callback(keyCode);
            }
        }

    };

}

var _wasdCallbacks = [];

function deleteById(domId, list) {
    var i = 0, L = list.length;
    for (; i < L; i++) {
        if (list[i].id === domId) {
            list.splice(i, 1);
            break;
        }
    }
}

module.exports = {

    /**
     * Event will be called when a WASD key was pressed and is up again
     * @param domId to make it removable
     * @param callback {function}
     */
    onWASDUp: function (domId, callback) {
        deleteById(domId, _wasdCallbacks);
        _wasdCallbacks.push({id: domId, callback: callback});
    },

    keyToButton: function () {
        return _keyToButton;
    }

};
},{"./KEYS.js":4,"./utils.js":7}],6:[function(require,module,exports){
/**
 * Created by Julian on 4/4/2015.
 */
"use strict";

require('./touchController.js');
var Utils = require('./utils.js');
var AnalogStick = require('./AnalogStick.js');
var DPad = require('./DPad.js');
var Button = require('./Button.js');
var KEYS = require('./KEYS.js');

var _diameter = Utils.diameter();
var _btnDiameter = Utils.btnDiameter();

if (Utils.isTouchDevice()) {
    document.write("<style id='touchControllerStyle'>.touchController{ " +
        "width:"+_diameter+"px;height:"+_diameter+"px;border:2px solid black;position:absolute;border-radius:50%;" +
        " } .innerTouchController {" +
        "width:5px;height:5px;margin-left:auto;margin-right:auto;margin-top:"+(Math.ceil(_diameter/2))+
        "px;background-color:black;}" +
        ".touchBtn{position:absolute;border:2px solid black;position:absolute;border-radius:50%;" +
        "width:"+_btnDiameter+"px;height:"+_btnDiameter+"px;}" +
        ".touchBtnTxt{text-align:center;line-height:"+_btnDiameter+"px;}" +
        ".touchBtn.pressed{background-color:cornflowerblue;}" +
        "</style>");
}

module.exports = {

    /**
     * Checks weather the current device can use touch or not
     * @returns {*}
     */
    isTouchDevice: function () {
        return Utils.isTouchDevice();
    },

    /**
     * strips away the default style
     */
    stripStyle: function () {
        var element = document.getElementById('touchControllerStyle');
        element.outerHTML = "";
    },

    AnalogStick: AnalogStick,

    DPad: DPad,

    Button: Button,

    KEYS: KEYS

};
},{"./AnalogStick.js":1,"./Button.js":2,"./DPad.js":3,"./KEYS.js":4,"./touchController.js":6,"./utils.js":7}],7:[function(require,module,exports){
/**
 * Created by Julian on 4/4/2015.
 */
"use strict";

function isTouchDevice() {
    return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

var _isTouchDevice = isTouchDevice();

var _isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

var _toDeg = 180 / Math.PI;

var _currentId = 0;

var _topTouchOffset = 0;
if (_isChrome) {
    _topTouchOffset = 100;
}

var _diameter = 140;
var _btnDiameter = 65;

module.exports = {

    diameter: function () {
        return _diameter;
    },

    btnDiameter: function () {
        return _btnDiameter;
    },

    /**
     * generates a new unique id
     * @returns {string}
     */
    newId: function () {
        return "touchController" + _currentId++;
    },

    /**
     * Checks weather the device can use touch or not
     * @returns {boolean}
     */
    isTouchDevice: function () {
        return _isTouchDevice;
    },

    /**
     * Returnes true when the renderer is Chrome
     * @returns {boolean}
     */
    isChrome: function () {
        return _isChrome;
    },

    /**
     *
     * @param elem
     * @returns {{top: number, left: number}}
     */
    getOffsetRect: function (elem) {
        // (1)
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        // (2)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        // (3)
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        // (4)
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    },

    /**
     * transforms two points to the degree in between
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {number}
     */
    getDegree: function(x1, y1, x2, y2) {
        var x = x1-x2;
        var y = y1-y2;
        var theta = Math.atan2(-y, x);
        if (theta < 0) theta += 2 * Math.PI;
        return theta * _toDeg;
    },

    /**
     * Needed for some offsetting
     * @returns {number}
     */
    topTouchOffset: function () {
        return _topTouchOffset;
    }

};
},{}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcQmFrYVxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImxpYlxcQW5hbG9nU3RpY2suanMiLCJsaWJcXEJ1dHRvbi5qcyIsImxpYlxcRFBhZC5qcyIsImxpYlxcS0VZUy5qcyIsImxpYlxca2V5Ym9hcmRDb250cm9sbGVyLmpzIiwibGliXFx0b3VjaENvbnRyb2xsZXIuanMiLCJsaWJcXHV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBKdWxpYW4gb24gNC80LzIwMTUuXHJcbiAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbmZ1bmN0aW9uIEFuYWxvZ1N0aWNrKGRvbWlkLCBwb3NpdGlvbikge1xyXG5cclxuICAgIHZhciB0b3BUb3VjaE9mZnNldCA9IFV0aWxzLnRvcFRvdWNoT2Zmc2V0KCk7XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09IEggRSBMIFAgRSBSICBGIFUgTiBDIFQgSSBPIE4gUyA9PT09PT09PT09PT1cclxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0YXJ0KGUpIHtcclxuICAgICAgICBzZWxmLnByZXNzZWQgPSB0cnVlO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBzZWxmLmZ4ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5zY3JlZW5YO1xyXG4gICAgICAgIHNlbGYuZnkgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnNjcmVlblkgLSB0b3BUb3VjaE9mZnNldDtcclxuICAgICAgICBpZiAoc2VsZi5hbGxvd09uQ2xpY2sgJiYgc2VsZi5vbkNsaWNrICE9PSBudWxsKSBzZWxmLm9uQ2xpY2suY2FsbChzZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVFbmQoZSkge1xyXG4gICAgICAgIHNlbGYucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAoc2VsZi5hbGxvd09uQ2xpY2sgJiYgc2VsZi5vblJlbGVhc2UgIT09IG51bGwpIHNlbGYub25SZWxlYXNlLmNhbGwoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlTW92ZShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHNlbGYuZnggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnNjcmVlblg7XHJcbiAgICAgICAgc2VsZi5meSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uc2NyZWVuWSAtIHRvcFRvdWNoT2Zmc2V0O1xyXG4gICAgICAgIGlmIChzZWxmLmFsbG93T25DbGljayAmJiBzZWxmLm9uQ2xpY2sgIT09IG51bGwpIHNlbGYub25DbGljay5jYWxsKHNlbGYpO1xyXG4gICAgfVxyXG4gICAgLy8gPT09PT09PT09PT09IEggRSBMIFAgRSBSICBGIFUgTiBDIFQgSSBPIE4gUyA9PT09PT09PT09PT1cclxuXHJcbiAgICB0aGlzLmFsbG93T25DbGljayA9IHRydWU7XHJcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21pZCk7XHJcbiAgICB2YXIgc3R5bGUgPSBcIlwiO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLCBpZDtcclxuICAgIHZhciBkaWFtZXRlciA9IFV0aWxzLmRpYW1ldGVyKCk7XHJcbiAgICBpZiAoVXRpbHMuaXNUb3VjaERldmljZSgpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwb3NpdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKFwiYm90dG9tXCIgaW4gcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgc3R5bGUgKz0gXCJib3R0b206XCIgK3Bvc2l0aW9uLmJvdHRvbSArIFwicHg7XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChcInRvcFwiIGluIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHN0eWxlICs9IFwidG9wOlwiICtwb3NpdGlvbi50b3AgKyBcInB4O1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXCJsZWZ0XCIgaW4gcG9zaXRpb24pe1xyXG4gICAgICAgICAgICBzdHlsZSArPSBcImxlZnQ6XCIgK3Bvc2l0aW9uLmxlZnQgKyBcInB4O1wiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXCJyaWdodFwiIGluIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHN0eWxlICs9IFwicmlnaHQ6XCIgK3Bvc2l0aW9uLnJpZ2h0ICsgXCJweDtcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWQgPSBVdGlscy5uZXdJZCgpO1xyXG4gICAgICAgIGVsLmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwiJytcclxuICAgICAgICAgICAgc3R5bGUrXHJcbiAgICAgICAgICAgICdcIiBpZD1cIicrIGlkXHJcbiAgICAgICAgICAgICsnXCIgY2xhc3M9XCJ0b3VjaENvbnRyb2xsZXJcIj48ZGl2IGNsYXNzPVwiaW5uZXJUb3VjaENvbnRyb2xsZXJcIj48L2Rpdj48L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLmZ4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5meSA9IC0xO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgdGhpcy55ID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uUmVsZWFzZSA9IG51bGw7XHJcblxyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGhhbmRsZVN0YXJ0LCBmYWxzZSk7XHJcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZUVuZCwgZmFsc2UpO1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlTW92ZSwgZmFsc2UpO1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBoYW5kbGVFbmQsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIHZhciBvID0gVXRpbHMuZ2V0T2Zmc2V0UmVjdChlbCk7XHJcbiAgICAgICAgICAgIHNlbGYueCA9IG8ubGVmdCArIE1hdGguY2VpbChkaWFtZXRlci8yKTtcclxuICAgICAgICAgICAgc2VsZi55ID0gby50b3AgKyBNYXRoLmNlaWwoZGlhbWV0ZXIvMik7XHJcbiAgICAgICAgfSwxMDApO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gTk9OLVRPVUNILURFVklDRVxyXG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BbmFsb2dTdGljay5wcm90b3R5cGUuaXNQcmVzc2VkID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLnByZXNzZWQ7XHJcbn07XHJcblxyXG5BbmFsb2dTdGljay5wcm90b3R5cGUuZ2V0RGVncmVlID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBVdGlscy5nZXREZWdyZWUodGhpcy54LCB0aGlzLnksIHRoaXMuZngsIHRoaXMuZnkpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbmFsb2dTdGljazsiLCIvKipcclxuICogQ3JlYXRlZCBieSBKdWxpYW4gb24gNC80LzIwMTUuXHJcbiAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xyXG52YXIgS2V5Ym9hcmRDb250cm9sbGVyID0gcmVxdWlyZSgnLi9rZXlib2FyZENvbnRyb2xsZXIuanMnKTtcclxudmFyIG5leHRJRCA9IDA7XHJcblxyXG5mdW5jdGlvbiBCdXR0b24oZG9taWQsIG5hbWUsIG9wdGlvbnMpIHtcclxuICAgIC8vID09PT09PT09PT09PSBIIEUgTCBQIEUgUiAgRiBVIE4gQyBUIEkgTyBOIFMgPT09PT09PT09PT09XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVTdGFydChlKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLmNsYXNzTmFtZSA9IFwidG91Y2hCdG4gcHJlc3NlZFwiO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVFbmQoZSkge1xyXG4gICAgICAgIGlmIChzZWxmLm9uQ2xpY2sgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgc2VsZi5vbkNsaWNrLmNhbGwoc2VsZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5jbGFzc05hbWUgPSBcInRvdWNoQnRuXCI7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUNhbmNlbChlKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuY2xhc3NOYW1lID0gXCJ0b3VjaEJ0blwiO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIC8vID09PT09PT09PT09PSBIIEUgTCBQIEUgUiAgRiBVIE4gQyBUIEkgTyBOIFMgPT09PT09PT09PT09XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9taWQpO1xyXG4gICAgdmFyIGtleVRvQnV0dG9uID0gS2V5Ym9hcmRDb250cm9sbGVyLmtleVRvQnV0dG9uKCk7XHJcbiAgICBpZiAoVXRpbHMuaXNUb3VjaERldmljZSgpKSB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gXCJcIjtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXCJib3R0b21cIiBpbiBvcHRpb25zKXtcclxuICAgICAgICAgICAgc3R5bGUgKz0gXCJib3R0b206XCIgK29wdGlvbnMuYm90dG9tICsgXCJweDtcIjtcclxuICAgICAgICB9IGVsc2UgaWYgKFwidG9wXCIgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICBzdHlsZSArPSBcInRvcDpcIiArb3B0aW9ucy50b3AgKyBcInB4O1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXCJsZWZ0XCIgaW4gb3B0aW9ucyl7XHJcbiAgICAgICAgICAgIHN0eWxlICs9IFwibGVmdDpcIiArb3B0aW9ucy5sZWZ0ICsgXCJweDtcIjtcclxuICAgICAgICB9IGVsc2UgaWYgKFwicmlnaHRcIiBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHN0eWxlICs9IFwicmlnaHQ6XCIgK29wdGlvbnMucmlnaHQgKyBcInB4O1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlkID0gXCJ0b3VjaEJ0blwiICsgbmV4dElEKys7XHJcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCInK1xyXG4gICAgICAgICAgICBzdHlsZStcclxuICAgICAgICAgICAgJ1wiIGlkPVwiJysgaWRcclxuICAgICAgICAgICAgKydcIiBjbGFzcz1cInRvdWNoQnRuXCI+PGRpdiBjbGFzcz1cInRvdWNoQnRuVHh0XCI+JyArIG5hbWUgKyc8L2Rpdj48L2Rpdj4nO1xyXG5cclxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVTdGFydCwgZmFsc2UpO1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVFbmQsIGZhbHNlKTtcclxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgaGFuZGxlQ2FuY2VsLCBmYWxzZSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBOT04gVE9VQ0ggREVWSUNFXHJcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XHJcbiAgICAgICAgaWYgKFwia2V5XCIgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICBrZXlUb0J1dHRvbltvcHRpb25zW1wia2V5XCJdXSA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5vbkNsaWNrID0gbnVsbDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdXR0b247IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSnVsaWFuIG9uIDQvNC8yMDE1LlxyXG4gKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcclxudmFyIEtleWJvYXJkQ29udHJvbGxlciA9IHJlcXVpcmUoJy4va2V5Ym9hcmRDb250cm9sbGVyLmpzJyk7XHJcbnZhciBBbmFsb2dTdGljayA9IHJlcXVpcmUoJy4vQW5hbG9nU3RpY2suanMnKTtcclxuXHJcbnZhciBsaXN0ZW5lciA9IC0xO1xyXG5cclxuZnVuY3Rpb24gRFBhZChkb21pZCwgb3B0aW9ucykge1xyXG4gICAgdmFyIENMSUNLX0lOVEVSVkFMX0lOX01TID0gNTAwO1xyXG4gICAgdmFyIElOVEVSVkFMX1NQRUVEID0gMTI1O1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGxhc3RUaW1lUHJlc3NlZE1zID0gMDtcclxuICAgIHZhciBmaXJzdENsaWNrID0gdHJ1ZTtcclxuICAgIHZhciBrZXlQcmVzc0NoZWNrID0gbnVsbDtcclxuICAgIHZhciBpc2tleWRvd24gPSBmYWxzZTtcclxuICAgIHZhciBjdXJyZW50S2V5ID0gLTE7XHJcblxyXG4gICAgQW5hbG9nU3RpY2suY2FsbCh0aGlzLCBkb21pZCxvcHRpb25zKTtcclxuICAgIGlmIChcIldBU0RFdmVudHNcIiBpbiBvcHRpb25zICYmIG9wdGlvbnNbXCJXQVNERXZlbnRzXCJdKXtcclxuICAgICAgICBpZiAobGlzdGVuZXIgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwobGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFV0aWxzLmlzVG91Y2hEZXZpY2UoKSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RDbGljaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RUaW1lUHJlc3NlZE1zID0gbm93O1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Q2xpY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHNlbGYuZ2V0RGlyZWN0aW9uKCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuVVA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblVwICE9PSBudWxsKSBzZWxmLm9uVXAuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuRE9XTjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uRG93biAhPT0gbnVsbCkgc2VsZi5vbkRvd24uY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uTGVmdCAhPT0gbnVsbCkgc2VsZi5vbkxlZnQuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuUklHSFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblJpZ2h0ICE9PSBudWxsKSBzZWxmLm9uUmlnaHQuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChub3cgLSBsYXN0VGltZVByZXNzZWRNcykgPiBDTElDS19JTlRFUlZBTF9JTl9NUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VGltZVByZXNzZWRNcyA9IG5vdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzZWxmLmdldERpcmVjdGlvbigpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRFBhZC5VUDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblVwICE9PSBudWxsKSBzZWxmLm9uVXAuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRFBhZC5ET1dOOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uRG93biAhPT0gbnVsbCkgc2VsZi5vbkRvd24uY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRFBhZC5MRUZUOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uTGVmdCAhPT0gbnVsbCkgc2VsZi5vbkxlZnQuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRFBhZC5SSUdIVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblJpZ2h0ICE9PSBudWxsKSBzZWxmLm9uUmlnaHQuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub25SZWxlYXNlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2xpY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAga2V5UHJlc3NDaGVjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNQcmVzc2VkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChub3cgLSBsYXN0VGltZVByZXNzZWRNcykgPiBDTElDS19JTlRFUlZBTF9JTl9NUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VGltZVByZXNzZWRNcyA9IG5vdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzZWxmLmdldERpcmVjdGlvbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuVVA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub25VcCAhPT0gbnVsbCkgc2VsZi5vblVwLmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuRE9XTjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vbkRvd24gIT09IG51bGwpIHNlbGYub25Eb3duLmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vbkxlZnQgIT09IG51bGwpIHNlbGYub25MZWZ0LmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuUklHSFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub25SaWdodCAhPT0gbnVsbCkgc2VsZi5vblJpZ2h0LmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTk9UIFRPVUNIIERFVklDRVxyXG4gICAgICAgICAgICB2YXIga2V5UHJlc3NlZCA9IHtcclxuICAgICAgICAgICAgICAgIFwiODdcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcIjY1XCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCI2OFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwiODNcIjogZmFsc2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZTtcclxuICAgICAgICAgICAgICAgIGlmIChrZXlDb2RlID09PSA4NyB8fCBrZXlDb2RlID09PSA2NSB8fCBrZXlDb2RlID09PSA2OCB8fCBrZXlDb2RlID09PSA4Mykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRLZXkgPSBrZXlDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGtleVByZXNzZWRbXCJcIitrZXlDb2RlXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5rZXlEaXJlY3Rpb24gPSBjdXJyZW50S2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIGlza2V5ZG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdENsaWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUaW1lUHJlc3NlZE1zID0gbm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdENsaWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuVVA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub25VcCAhPT0gbnVsbCkgc2VsZi5vblVwLmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuRE9XTjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vbkRvd24gIT09IG51bGwpIHNlbGYub25Eb3duLmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vbkxlZnQgIT09IG51bGwpIHNlbGYub25MZWZ0LmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuUklHSFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub25SaWdodCAhPT0gbnVsbCkgc2VsZi5vblJpZ2h0LmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG5vdyAtIGxhc3RUaW1lUHJlc3NlZE1zKSA+IENMSUNLX0lOVEVSVkFMX0lOX01TKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VGltZVByZXNzZWRNcyA9IG5vdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEUGFkLlVQOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblVwICE9PSBudWxsKSBzZWxmLm9uVXAuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEUGFkLkRPV046XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uRG93biAhPT0gbnVsbCkgc2VsZi5vbkRvd24uY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEUGFkLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uTGVmdCAhPT0gbnVsbCkgc2VsZi5vbkxlZnQuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEUGFkLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblJpZ2h0ICE9PSBudWxsKSBzZWxmLm9uUmlnaHQuY2FsbChzZWxmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIEtleWJvYXJkQ29udHJvbGxlci5vbldBU0RVcChkb21pZCwgZnVuY3Rpb24gKGtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXlDb2RlID09PSA4NyB8fCBrZXlDb2RlID09PSA2NSB8fCBrZXlDb2RlID09PSA2OCB8fCBrZXlDb2RlID09PSA4Mykge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleVByZXNzZWRbXCJcIitrZXlDb2RlXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgha2V5UHJlc3NlZFtcIjg3XCJdICYmICFrZXlQcmVzc2VkW1wiNjVcIl0gJiYgIWtleVByZXNzZWRbXCI2OFwiXSAmJiAha2V5UHJlc3NlZFtcIjgzXCJdKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5rZXlEaXJlY3Rpb24gPSBEUGFkLk5PTkU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlza2V5ZG93biA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdENsaWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBrZXlQcmVzc0NoZWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNrZXlkb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgobm93IC0gbGFzdFRpbWVQcmVzc2VkTXMpID4gQ0xJQ0tfSU5URVJWQUxfSU5fTVMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWVQcmVzc2VkTXMgPSBub3c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY3VycmVudEtleSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuVVA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub25VcCAhPT0gbnVsbCkgc2VsZi5vblVwLmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuRE9XTjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vbkRvd24gIT09IG51bGwpIHNlbGYub25Eb3duLmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vbkxlZnQgIT09IG51bGwpIHNlbGYub25MZWZ0LmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERQYWQuUklHSFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub25SaWdodCAhPT0gbnVsbCkgc2VsZi5vblJpZ2h0LmNhbGwoc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaXN0ZW5lciA9IHNldEludGVydmFsKGtleVByZXNzQ2hlY2ssIElOVEVSVkFMX1NQRUVEKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblVwID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uRG93biA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vbkxlZnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25SaWdodCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICB0aGlzLmtleURpcmVjdGlvbiA9IERQYWQuTk9ORTtcclxufVxyXG5cclxuRFBhZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFuYWxvZ1N0aWNrLnByb3RvdHlwZSk7XHJcblxyXG5EUGFkLlVQID0gODc7XHJcbkRQYWQuRE9XTiA9IDgzO1xyXG5EUGFkLkxFRlQgPSA2NTtcclxuRFBhZC5SSUdIVCA9IDY4O1xyXG5EUGFkLk5PTkUgPSAtMTtcclxuXHJcbmlmIChVdGlscy5pc1RvdWNoRGV2aWNlKCkpIHtcclxuICAgIERQYWQucHJvdG90eXBlLmdldERpcmVjdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQcmVzc2VkKCkpIHtcclxuICAgICAgICAgICAgdmFyIGRlZyA9IHRoaXMuZ2V0RGVncmVlKCk7XHJcbiAgICAgICAgICAgIGlmIChkZWcgPCA0NSB8fCBkZWcgPj0gMzE1KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBEUGFkLkxFRlQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVnIDwgMzE1ICYmIGRlZyA+PSAyMjUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBEUGFkLlVQO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlZyA8IDIyNSAmJiBkZWcgPj0gMTM1KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRFBhZC5SSUdIVDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBEUGFkLkRPV047XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gRFBhZC5OT05FO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0gZWxzZSB7XHJcbiAgICBEUGFkLnByb3RvdHlwZS5nZXREaXJlY3Rpb24gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmtleURpcmVjdGlvbjtcclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRFBhZDsiLCIvKipcclxuICogQ3JlYXRlZCBieSBKdWxpYW4gb24gNC80LzIwMTUuXHJcbiAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBTUEFDRSA6IFwic3BcIixcclxuICAgIEVOVEVSIDogXCJlblwiLFxyXG4gICAgRVNDIDogXCJlc2NcIixcclxuICAgIFEgOiBcInFcIixcclxuICAgIEUgOiBcImVcIlxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEp1bGlhbiBvbiA0LzQvMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xyXG52YXIgS0VZUyA9IHJlcXVpcmUoJy4vS0VZUy5qcycpO1xyXG5cclxudmFyIF9rZXlUb0J1dHRvbiA9IHt9O1xyXG5cclxuZnVuY3Rpb24gdGVzdEFuZEV4ZWNLZXkoa2V5Y29kZSwgZXhwZWN0ZWRLZXljb2RlLCB2YWx1ZSkge1xyXG4gICAgaWYgKGV4cGVjdGVkS2V5Y29kZSA9PT0ga2V5Y29kZSAmJiB2YWx1ZSBpbiBfa2V5VG9CdXR0b24pIHtcclxuICAgICAgICB2YXIgYnRuID0gX2tleVRvQnV0dG9uW3ZhbHVlXTtcclxuICAgICAgICBpZiAoYnRuLm9uQ2xpY2sgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgYnRuLm9uQ2xpY2suY2FsbChidG4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuaWYgKCFVdGlscy5pc1RvdWNoRGV2aWNlKCkpIHtcclxuXHJcbiAgICBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24gKGUpIHtcclxuXHJcbiAgICAgICAgdmFyIGtleUNvZGUgPSBlLmtleUNvZGU7XHJcblxyXG4gICAgICAgIC8vIGlnbm9yZSBXQVNEXHJcbiAgICAgICAgaWYgKGtleUNvZGUgIT09IDg3ICYmIGtleUNvZGUgIT09IDY1ICYmXHJcbiAgICAgICAgICAgIGtleUNvZGUgIT09IDgzICYmIGtleUNvZGUgIT09IDY4KSB7XHJcbiAgICAgICAgICAgIGlmICghdGVzdEFuZEV4ZWNLZXkoa2V5Q29kZSwgMzIsIEtFWVMuU1BBQ0UpKVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0ZXN0QW5kRXhlY0tleShrZXlDb2RlLCAxMywgS0VZUy5FTlRFUikpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0ZXN0QW5kRXhlY0tleShrZXlDb2RlLCAyNywgS0VZUy5FU0MpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRlc3RBbmRFeGVjS2V5KGtleUNvZGUsIDgxLCBLRVlTLlEpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0ZXN0QW5kRXhlY0tleShrZXlDb2RlLCA2OSwgS0VZUy5FKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMCwgTCA9IF93YXNkQ2FsbGJhY2tzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yICg7IGkgPCBMOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIF93YXNkQ2FsbGJhY2tzW2ldLmNhbGxiYWNrKGtleUNvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59XHJcblxyXG52YXIgX3dhc2RDYWxsYmFja3MgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZUJ5SWQoZG9tSWQsIGxpc3QpIHtcclxuICAgIHZhciBpID0gMCwgTCA9IGxpc3QubGVuZ3RoO1xyXG4gICAgZm9yICg7IGkgPCBMOyBpKyspIHtcclxuICAgICAgICBpZiAobGlzdFtpXS5pZCA9PT0gZG9tSWQpIHtcclxuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCB3aWxsIGJlIGNhbGxlZCB3aGVuIGEgV0FTRCBrZXkgd2FzIHByZXNzZWQgYW5kIGlzIHVwIGFnYWluXHJcbiAgICAgKiBAcGFyYW0gZG9tSWQgdG8gbWFrZSBpdCByZW1vdmFibGVcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259XHJcbiAgICAgKi9cclxuICAgIG9uV0FTRFVwOiBmdW5jdGlvbiAoZG9tSWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgZGVsZXRlQnlJZChkb21JZCwgX3dhc2RDYWxsYmFja3MpO1xyXG4gICAgICAgIF93YXNkQ2FsbGJhY2tzLnB1c2goe2lkOiBkb21JZCwgY2FsbGJhY2s6IGNhbGxiYWNrfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGtleVRvQnV0dG9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9rZXlUb0J1dHRvbjtcclxuICAgIH1cclxuXHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSnVsaWFuIG9uIDQvNC8yMDE1LlxyXG4gKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5yZXF1aXJlKCcuL3RvdWNoQ29udHJvbGxlci5qcycpO1xyXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XHJcbnZhciBBbmFsb2dTdGljayA9IHJlcXVpcmUoJy4vQW5hbG9nU3RpY2suanMnKTtcclxudmFyIERQYWQgPSByZXF1aXJlKCcuL0RQYWQuanMnKTtcclxudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4vQnV0dG9uLmpzJyk7XHJcbnZhciBLRVlTID0gcmVxdWlyZSgnLi9LRVlTLmpzJyk7XHJcblxyXG52YXIgX2RpYW1ldGVyID0gVXRpbHMuZGlhbWV0ZXIoKTtcclxudmFyIF9idG5EaWFtZXRlciA9IFV0aWxzLmJ0bkRpYW1ldGVyKCk7XHJcblxyXG5pZiAoVXRpbHMuaXNUb3VjaERldmljZSgpKSB7XHJcbiAgICBkb2N1bWVudC53cml0ZShcIjxzdHlsZSBpZD0ndG91Y2hDb250cm9sbGVyU3R5bGUnPi50b3VjaENvbnRyb2xsZXJ7IFwiICtcclxuICAgICAgICBcIndpZHRoOlwiK19kaWFtZXRlcitcInB4O2hlaWdodDpcIitfZGlhbWV0ZXIrXCJweDtib3JkZXI6MnB4IHNvbGlkIGJsYWNrO3Bvc2l0aW9uOmFic29sdXRlO2JvcmRlci1yYWRpdXM6NTAlO1wiICtcclxuICAgICAgICBcIiB9IC5pbm5lclRvdWNoQ29udHJvbGxlciB7XCIgK1xyXG4gICAgICAgIFwid2lkdGg6NXB4O2hlaWdodDo1cHg7bWFyZ2luLWxlZnQ6YXV0bzttYXJnaW4tcmlnaHQ6YXV0bzttYXJnaW4tdG9wOlwiKyhNYXRoLmNlaWwoX2RpYW1ldGVyLzIpKStcclxuICAgICAgICBcInB4O2JhY2tncm91bmQtY29sb3I6YmxhY2s7fVwiICtcclxuICAgICAgICBcIi50b3VjaEJ0bntwb3NpdGlvbjphYnNvbHV0ZTtib3JkZXI6MnB4IHNvbGlkIGJsYWNrO3Bvc2l0aW9uOmFic29sdXRlO2JvcmRlci1yYWRpdXM6NTAlO1wiICtcclxuICAgICAgICBcIndpZHRoOlwiK19idG5EaWFtZXRlcitcInB4O2hlaWdodDpcIitfYnRuRGlhbWV0ZXIrXCJweDt9XCIgK1xyXG4gICAgICAgIFwiLnRvdWNoQnRuVHh0e3RleHQtYWxpZ246Y2VudGVyO2xpbmUtaGVpZ2h0OlwiK19idG5EaWFtZXRlcitcInB4O31cIiArXHJcbiAgICAgICAgXCIudG91Y2hCdG4ucHJlc3NlZHtiYWNrZ3JvdW5kLWNvbG9yOmNvcm5mbG93ZXJibHVlO31cIiArXHJcbiAgICAgICAgXCI8L3N0eWxlPlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3Mgd2VhdGhlciB0aGUgY3VycmVudCBkZXZpY2UgY2FuIHVzZSB0b3VjaCBvciBub3RcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBpc1RvdWNoRGV2aWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIFV0aWxzLmlzVG91Y2hEZXZpY2UoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzdHJpcHMgYXdheSB0aGUgZGVmYXVsdCBzdHlsZVxyXG4gICAgICovXHJcbiAgICBzdHJpcFN0eWxlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG91Y2hDb250cm9sbGVyU3R5bGUnKTtcclxuICAgICAgICBlbGVtZW50Lm91dGVySFRNTCA9IFwiXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIEFuYWxvZ1N0aWNrOiBBbmFsb2dTdGljayxcclxuXHJcbiAgICBEUGFkOiBEUGFkLFxyXG5cclxuICAgIEJ1dHRvbjogQnV0dG9uLFxyXG5cclxuICAgIEtFWVM6IEtFWVNcclxuXHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSnVsaWFuIG9uIDQvNC8yMDE1LlxyXG4gKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBpc1RvdWNoRGV2aWNlKCkge1xyXG4gICAgcmV0dXJuICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KVxyXG4gICAgICAgIHx8IChuYXZpZ2F0b3IuTWF4VG91Y2hQb2ludHMgPiAwKVxyXG4gICAgICAgIHx8IChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApKTtcclxufVxyXG5cclxudmFyIF9pc1RvdWNoRGV2aWNlID0gaXNUb3VjaERldmljZSgpO1xyXG5cclxudmFyIF9pc0Nocm9tZSA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjaHJvbWUnKSA+IC0xO1xyXG5cclxudmFyIF90b0RlZyA9IDE4MCAvIE1hdGguUEk7XHJcblxyXG52YXIgX2N1cnJlbnRJZCA9IDA7XHJcblxyXG52YXIgX3RvcFRvdWNoT2Zmc2V0ID0gMDtcclxuaWYgKF9pc0Nocm9tZSkge1xyXG4gICAgX3RvcFRvdWNoT2Zmc2V0ID0gMTAwO1xyXG59XHJcblxyXG52YXIgX2RpYW1ldGVyID0gMTQwO1xyXG52YXIgX2J0bkRpYW1ldGVyID0gNjU7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICBkaWFtZXRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfZGlhbWV0ZXI7XHJcbiAgICB9LFxyXG5cclxuICAgIGJ0bkRpYW1ldGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9idG5EaWFtZXRlcjtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnZW5lcmF0ZXMgYSBuZXcgdW5pcXVlIGlkXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBuZXdJZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBcInRvdWNoQ29udHJvbGxlclwiICsgX2N1cnJlbnRJZCsrO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyB3ZWF0aGVyIHRoZSBkZXZpY2UgY2FuIHVzZSB0b3VjaCBvciBub3RcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBpc1RvdWNoRGV2aWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pc1RvdWNoRGV2aWNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybmVzIHRydWUgd2hlbiB0aGUgcmVuZGVyZXIgaXMgQ2hyb21lXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgaXNDaHJvbWU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX2lzQ2hyb21lO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZWxlbVxyXG4gICAgICogQHJldHVybnMge3t0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyfX1cclxuICAgICAqL1xyXG4gICAgZ2V0T2Zmc2V0UmVjdDogZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAvLyAoMSlcclxuICAgICAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgdmFyIGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICAgICAgLy8gKDIpXHJcbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbFRvcCB8fCBib2R5LnNjcm9sbFRvcDtcclxuICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbExlZnQgfHwgYm9keS5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIC8vICgzKVxyXG4gICAgICAgIHZhciBjbGllbnRUb3AgPSBkb2NFbGVtLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwO1xyXG4gICAgICAgIHZhciBjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwO1xyXG4gICAgICAgIC8vICg0KVxyXG4gICAgICAgIHZhciB0b3AgPSBib3gudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wO1xyXG4gICAgICAgIHZhciBsZWZ0ID0gYm94LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdDtcclxuICAgICAgICByZXR1cm4geyB0b3A6IE1hdGgucm91bmQodG9wKSwgbGVmdDogTWF0aC5yb3VuZChsZWZ0KSB9O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIHRyYW5zZm9ybXMgdHdvIHBvaW50cyB0byB0aGUgZGVncmVlIGluIGJldHdlZW5cclxuICAgICAqIEBwYXJhbSB4MVxyXG4gICAgICogQHBhcmFtIHkxXHJcbiAgICAgKiBAcGFyYW0geDJcclxuICAgICAqIEBwYXJhbSB5MlxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0RGVncmVlOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICAgIHZhciB4ID0geDEteDI7XHJcbiAgICAgICAgdmFyIHkgPSB5MS15MjtcclxuICAgICAgICB2YXIgdGhldGEgPSBNYXRoLmF0YW4yKC15LCB4KTtcclxuICAgICAgICBpZiAodGhldGEgPCAwKSB0aGV0YSArPSAyICogTWF0aC5QSTtcclxuICAgICAgICByZXR1cm4gdGhldGEgKiBfdG9EZWc7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTmVlZGVkIGZvciBzb21lIG9mZnNldHRpbmdcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHRvcFRvdWNoT2Zmc2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF90b3BUb3VjaE9mZnNldDtcclxuICAgIH1cclxuXHJcbn07Il19
