@echo off

rem usage:1) just execute the batch by double click
rem usage:2) cmd>herokuDeployment.bat "your commit message here"
rem note: add >null to the end of command lines to hide output messages (ex: git status >null)

git status 
git add . 
git status
set message="%~1 committed at %date%_%time%"
git commit -m %message% 
git push heroku master
pause 