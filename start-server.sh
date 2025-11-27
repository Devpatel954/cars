#!/bin/bash
echo "=== Starting server with environment ==="
echo "NODE_ENV: $NODE_ENV"
echo "MONGODB_URI: ${MONGODB_URI:0:20}..."
echo "JWT_SECRET: ${JWT_SECRET:0:10}..."
echo "PORT: $PORT"
echo ""

cd server
npm install
npm start
