#!/bin/sh

printf 'Content-type: application/json\r\n\r\n{"arch": "%s"}' $(uname -m)
