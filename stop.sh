#!/bin/sh

# -----------------------------------------------------------------------------
# Stop Script for the prepublish Server
# -----------------------------------------------------------------------------

ps aux|grep "index.js" | grep  "node" |grep -v "color=auto"|grep -v "grep"| awk '{print "kill -9 "$2}' | sh
















