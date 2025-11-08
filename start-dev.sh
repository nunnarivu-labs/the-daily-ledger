#!/bin/bash

# This function will be executed when the script exits
cleanup() {
    echo "Shutting down. Stopping Docker containers..."
    npm run docker:stop
}

# 'trap' will execute the 'cleanup' function on the EXIT signal
# This includes normal exit and being interrupted (Ctrl+C)
trap cleanup EXIT

# Start the Docker containers in the background
echo "Starting Docker containers..."
npm run docker:start

# Start the Next.js dev server in the foreground
# The script will wait here until you stop it with Ctrl+C
npm run dev
