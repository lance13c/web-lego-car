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