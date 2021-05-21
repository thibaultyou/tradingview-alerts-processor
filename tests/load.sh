#!/bin/bash

curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "XTZ-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 1" &
curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ALGO-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 2" &
curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ADA-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 3" &
curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "THETA-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 4" &
curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "XRP-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 5" &
curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "DOGE-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 6" &
curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "BTC-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 7" &
curl -H 'Content-Type: application/json; charset=utf-8' -d '{"stub": "test", "symbol": "ALT-PERP", "size": "11", "direction": "long"}' -X POST http://localhost:3000/trades && echo "done 8" &

wait