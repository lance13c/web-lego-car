#!/bin/bash
nohup python ./dist/server/services/turn.py &
nohup npm start &
