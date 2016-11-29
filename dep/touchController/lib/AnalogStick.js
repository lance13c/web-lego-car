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