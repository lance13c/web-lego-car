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