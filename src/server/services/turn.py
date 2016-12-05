import socketio
import RPi.GPIO as GPIO
import eventlet
import eventlet.wsgi
from flask import Flask, render_template
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(19, GPIO.OUT)
pwm = GPIO.PWM(19, 100)
pwm.start(5)

def update(angle):
    duty = float(angle) / 10.0 + 2.5
    pwm.ChangeDutyCycle(duty)


sio = socketio.Server()
PORT = 8080
app = Flask(__name__)

@app.route('/')
def index():
    """Serve the client-side application."""
    return render_template('index.html')

@sio.on('connect', namespace='/servo')
def connect(sid, environ):
    print("connect ", sid)

@sio.on('turn', namespace='/servo')
def message(sid, data):
    data = str(data)
    print("message: " + data)
    if (data.isdigit()):
        update(int(data))
        print("Turned to: " + str(data))
    else:
        print("Data no digit")
        
    sio.emit('reply:', room=sid)

@sio.on('disconnect', namespace='/servo')
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    # wrap Flask application with engineio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 8080)), app)
