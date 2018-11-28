#!/bin/bash
export SERVER__PORT=9999 &&
export SERVER__SRC_FOLDER="site" &&
export SERVER__URL="http://localhost:${SERVER__PORT}" &&
export SERVER__START_CALLBACK="ops/scripts/request-refresh-browser-script.js" &&

export SERVER_LIVERELOAD_PROXY__PORT=4444 &&
export SERVER_LIVERELOAD_PROXY__URL="http://localhost:${SERVER_LIVERELOAD_PROXY__PORT}" &&

export SERVER_APP_RESTARTER__PORT=6601 &&
export SERVER_APP_RESTARTER__LAUNCH_FILE="server.js" &&
export SERVER_APP_RESTARTER__URL="http://localhost:${SERVER_APP_RESTARTER__PORT}" &&

export SERVER_BROWSER_RESTARTER__PORT=6602 &&
export SERVER_BROWSER_RESTARTER__URL="http://localhost:${SERVER_BROWSER_RESTARTER__PORT}" &&

export WATCHER_AND_RUNNER__PORT=6603 &&
export WATCHER_AND_RUNNER__WAY_TO_CONFIG="ops/scripts/watcher-and-runner.conf.js" &&

export WEBPACK_RUNNER__PORT=6604 &&
export WEBPACK_RUNNER__WAY_TO_COMPILER="webpack-compiler.js"

export LOG_FOLDER="logs"


