@echo off
setlocal

set LogFile=dexbot_runtime.log

:loop
echo MHDexBot is now running
echo MHDexBot is now running >> %LogFile%
node MHDexBot.js >> %LogFile% 2>&1
echo MHDexBot had an error, restarting now
echo MHDexBot had an error, restarting now >> %LogFile%
goto loop
