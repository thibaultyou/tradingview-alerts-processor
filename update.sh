#!/bin/bash

echo ''
echo 'Stopping PM2...'
echo ''
pm2 stop server

echo ''
echo 'Pulling updates...'
echo ''
git pull

echo ''
echo 'Installing dependencies...'
echo ''
npm i

echo ''
echo 'Starting PM2...'
echo ''
pm2 start server