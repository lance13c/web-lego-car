# web-lego-car

Controlling a lego car via a webpage controller

## Install Node & Npm on RPI
	curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
	sudo apt-POST install -y nodejs

## Install Remote Desktop

[TightVCN](https://eltechs.com/3-ways-to-run-a-remote-desktop-on-raspberry-pi/)


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