# web-lego-car

Controlling a lego car via a webpage controller

![Finished Vehicle Image](https://raw.githubusercontent.com/lance13c/web-lego-car/master/images/0.jpg)

####Demo: https://youtu.be/NGugRwT2zvg

## Setup for Development

### Install Node Version 6 & Npm
Will not work with Node Version > 6.x

Download: https://nodejs.org/en/

### Clone the Repo

Go to a file directory and type the following

    git clone https://github.com/lance13c/web-lego-car
    
If git is not recognized download git [here](https://git-scm.com/download) or download it as a zip file.


### Setup config files

**Note this only works your computer has a public url. If it does not, the server will
still run but will throw errors when trying to make the REST calls.**

Find the project folder.

    cd C:/users/you/folder/path/web-lego-car/
    
Got into **config.js**
    
    nano C:/users/you/folder/path/web-lego-car/src/webapp/js/config.js
    
Change the url to be your public url or public domain

    url: "http://URL_HERE:3000"
    
or

    url: "http://DOMAIN_NAME_HERE:3000"
    
Now go into **serverConfig.js**

    nano C:/users/you/folder/path/web-lego-car/src/server/services/serverConfig.js

Change the socket url to your public url or public domain

    SOCKET_URL: "http://URL_HERE:8080/servo",
    
or

    SOCKET_URL: "http://DOMAIN_NAME_HERE:8080/servo",

### Run Setup Commands

Go into the project folder.

    cd C:/users/you/folder/path/web-lego-car/
   
Download node dependencies.

    npm install
    
Build and Run the server

    npm start
    
    
If this is not running on the RPI an error "Connot find module 'rpio' will appear.

This is totally fine. It just indicates it will not send data to the GPIOs.


### Outcome

In the console development tools in the browser.
You are now able to see if the REST call are being sent. 
If a {"complete": true} is returned, it went through successfully. 

In the terminal npm start was entered into you should see output logs of what
the webapp is telling the server to do (the data it is receiving). 





### Setup for RPI (Documentation Not Complete)

#### Change Keyboard to US keyboard layout 
Fixes wrong keyboard symbols

    sudo nano /etc/default/keyboard
    
Change the XKBLAYOUT propery to us:

    XKBLAYOUT="us"
    
#### Install Node & Npm on RPI
	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-POST install -y nodejs
	
Note: Install version 6 not 7. GPIO library only works with versions < 7

#### Install Python Dev

    sudo apt-get install python-dev

**Not Complete, forgot specifics for Python & RPI dependencies**

#### Run on RPI

start.sh starts both the NodeJS and Python webservers

    bash ./start

kill.sh will stop both webservers.

    bash ./kill
    
#### Install Remote Desktop (optional)

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
    
    
    
## FAQ

**Problem** node gyp error TRACKER : error TRK0005
**Solution:** http://stackoverflow.com/questions/33183161/node-gyp-error-tracker-error-trk0005-failed-to-locate-cl-exe-the-system-c/38387213

## Extras

### Get Npm Start to work on boot

Edit rc.local

    nano /etc/rc.local
    
Add commands under comments, before exit 0

    cd /home/my/mode/project/folder && npm start