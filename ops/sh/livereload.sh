#!/bin/bash
eval `grep "^export " ./ops/sh/env.sh` && \
node node_modules/concurrently/src/main.js \
"node ops/microservices/server-livereload-proxy.js" \
"node ops/microservices/server-browser-restarter.js"
