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