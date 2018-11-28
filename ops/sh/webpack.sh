#!/bin/bash
eval `grep "^export " ./ops/sh/env.sh` && \
node node_modules/webpack/bin/webpack.js --mode=development --watch