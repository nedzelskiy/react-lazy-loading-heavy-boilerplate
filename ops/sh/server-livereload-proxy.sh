#!/bin/bash
eval `grep "^export " ./ops/sh/env.sh` && \
node ops/microservices/server-livereload-proxy.js