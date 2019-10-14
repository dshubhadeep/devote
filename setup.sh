#!/bin/bash    

# remove build dir
rm -rvf ./frontend/contracts
# compile contract
truffle compile
# # deploy on dev network
truffle migrate
# # get deployed address
truffle exec deployUtil.js