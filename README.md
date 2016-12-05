# web-lego-car

Controlling a lego car via a webpage controller

## Change Keyboard to US keyboard layout 
Fixes wrong keyboard symbols

    sudo nano /etc/default/keyboard
    
Change the XKBLAYOUT propery to us:

    XKBLAYOUT="us"
    
Reboot the RPI


## Install Node & Npm on RPI
	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-POST install -y nodejs

Note: Install version 6 not 7. GPIO library only works with versions < 7

## Install Remote Desktop

[TightVCN](https://eltechs.com/3-ways-to-run-a-remote-desktop-on-raspberry-pi/)


## Install Python Dev

    sudo apt-get install python-dev

##API

POST */vehicle/forward*

Start moving the vehicle forward

    request data: {
        speed: Number 0-1
    }
    
POST */vehicle/backward*

Start moving the vehicle backward

    request data: {
        speed: Number 0-1
    }
    
POST */vehicle/stop*

Stops the vehicle
    
POST */vehicle/dir*

Sets the direction of the wheels (Servo direction)

    request data: {
        dir: Number 0-180
    }
    
POST */vehicle/diroffset*

Sets the direction offset (Servo offset)

    request data: {
        offset: Num 0-180
    }
    
    
    
## FAQ

**Problem** node gyp error TRACKER : error TRK0005
**Solution:** http://stackoverflow.com/questions/33183161/node-gyp-error-tracker-error-trk0005-failed-to-locate-cl-exe-the-system-c/38387213