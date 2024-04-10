#!/bin/bash
exec 3>&1 1>"dexbot_runtime.log" 2>&1
set -x
while true
do
node MHDexBot.js
done
