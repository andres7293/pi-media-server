#!/bin/bash

SERVADDR=$1
FNAME=$2

curl -v --header 'Content-Type: text/plain' --request DELETE ${SERVADDR} --data "${FNAME}"
