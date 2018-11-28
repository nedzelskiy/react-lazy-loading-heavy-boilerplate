#!/bin/bash
eval `grep "^export " ./ops/sh/env.sh` && \
node ops/microservices/webpack-runner.js