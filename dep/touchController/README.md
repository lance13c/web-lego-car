TouchController

- Browser-Touch-Controller with Fallback to Keyboard

following HTML is given:
```html
<div id="dpad"></div>
<div id="analog"></div>
<div id="abtn"></div>
```

```javascript

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ANALOG STICK
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Create a analog stick that measures the user input
// in a 360Deg manner.
var analogStick = new TouchController.AnalogStick(
    "analog",
    {left: 100, bottom: 5}
);

// querying the analog stick:
var isPressed = analogStick.isPressed(); // BOOLEAN
var degree = analogStick.getDegree(); // DOUBLE

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DPAD
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

// When WSADEvents=true, the dpad will be mapped to the
// W A S D-Buttons on a keyboard, if no touch device is available
var dpad = new TouchController.DPad(
    "dpad",
    {top: 10, right: 5, WASDEvents: true}
);

// querying the dpad:
// The result is one of the following Values:
// * TouchController.DPad.UP
// * TouchController.DPad.DOWN
// * TouchController.DPad.LEFT
// * TouchController.DPad.RIGHT
// * TouchController.DPad.NONE
var direction = dpad.getDirection(); // ENUM

// the DPad also provides callbacks for direction events, when
// WASDEvents=true:
dpad.onUp = function() {
    ...
}
dpad.onDown = function() {
    ...
}
dpad.onLeft = function() {
    ...
}
dpad.onRight = function() {
    ...
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BUTTON
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

// create a new Button with the Text: "A"
// When no touch device is available, the button event
// will be mapped to the Key, provided as "key"-paramter
var a = new TouchController.Button(
    "abtn",
    "A",
    {bottom:2, left: 180, key: TouchController.KEYS.SPACE}
);

// listen to the click-Event:
a.onClick = function(){
    ...
}



```