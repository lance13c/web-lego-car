import RPi.GPIO as GPIO
import time
import sys

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(19, GPIO.OUT)
pwm = GPIO.PWM(19, 100)
pwm.start(5)

count = 0
on = True

#Get the Angle from Arguments - First Arg
#angleArg = int(sys.argv[1])


def turn(angle):
    if (angle > 180):
        angle = 180
        
    if (angle < 0):
        angle = 0
    duty = float(angle) / 10.0 + 2.5
    pwm.ChangeDutyCycle(duty)
    print(angle)
    time.sleep(1)

# Loops awaiting turning inputs
while (on == True):
    data = input()              # either false or angle(integer)
    if (str(data) == "false"):
        on = False
    else:
        turn(data)
