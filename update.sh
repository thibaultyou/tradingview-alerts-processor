#!/bin/bash

echo ''
echo 'Stopping PM2...'
echo ''
pm2 stop npm

echo ''
echo 'Pulling updates...'
echo ''
git pull

echo ''
echo 'Installing dependencies and rebuilding app...'
echo ''
npm i
npm run build

echo ''
echo 'Starting PM2...'
echo ''
pm2 start npm