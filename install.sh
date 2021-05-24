#!/bin/bash

echo ''
echo 'Installing dependencies...'
echo ''
npm i
sudo npm i -g pm2
sudo pm2 install typescript

echo ''
echo 'Configuring Apache...'
echo ''
sudo cp /opt/bitnami/apache/conf/vhosts/sample-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-vhost.conf
sudo cp /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf
sudo /opt/bitnami/ctlscript.sh restart apache

echo ''
echo 'Configuring PM2...'
echo ''
pm2 startup
pm2 start server.ts --watch
sudo env PATH=$PATH:/opt/bitnami/node/bin /opt/bitnami/node/lib/node_modules/pm2/bin/pm2 startup systemd -u bitnami --hp /home/bitnami
pm2 save