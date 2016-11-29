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