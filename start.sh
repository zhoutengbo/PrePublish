#!/bin/sh

# -----------------------------------------------------------------------------
# Start Script for the prepblish Server
# -----------------------------------------------------------------------------

cd /root/data115/zhoutengbo/www/
basepath=$(cd $(dirname $0) && pwd)

LD_LIBRARY_PATH=$basepath:$LD_LIBRARY_PATH

export LD_LIBRARY_PATH


if [ ! -d /corefile ]
then
        mkdir /corefile
fi

if [ -e ./single_obj_ext_service ]
then
    rm -rf single_obj_ext_service
fi

echo "/corefile/core-%e-%p-%t" > /proc/sys/kernel/core_pattern

ulimit -c unlimited
nohup node $basepath/index.js > $basepath/nohup.out.txt 2>&1 &
