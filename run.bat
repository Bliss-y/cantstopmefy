@echo off
explorer "http://localhost:8001/default"
nodemon --ignore config.json --ignore cantStopYouToobe/ index.js