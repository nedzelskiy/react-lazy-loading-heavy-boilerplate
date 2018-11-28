#!/bin/bash
eval `grep "^export " ./ops/sh/env.sh` && \
node node_modules/concurrently/src/main.js \
"sh ./ops/sh/server-livereload-proxy.sh" \
"sh ./ops/sh/server-app-restarter.sh" \
"sh ./ops/sh/server-browser-restarter.sh" \
"sh ./ops/sh/watcher-and-runner.sh" \
"sh ./ops/sh/webpack-runner.sh"
