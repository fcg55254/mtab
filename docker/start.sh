#!/bin/bash

php-fpm7

nginx

nohup redis-server /opt/redis.conf & > /dev/null &

lock_file="/move.lock"
source_dir="/www/"
destination_dir="/app"

if [ ! -e "$destination_dir" ]; then
    mkdir "$destination_dir"
fi

chmod -R 777 "$destination_dir"

# 检查是否存在锁文件
if [ ! -e "$lock_file" ]; then
    # 如果锁文件不存在，执行移动操作
    chmod -R 777 "$source_dir"
    rsync -aL "$source_dir/" "$destination_dir"
    chmod -R 777 "$destination_dir"
    # 创建锁文件
    touch "$lock_file"
    rm -rf "$source_dir"
fi

if [ -e "/app/public/installed.lock" ]; then
    # 如果锁文件存在，执行以下更新数据库操作
    echo "检查数据库更新..."
    php "$destination_dir/think" repair
else
  php "/app/env.php";#安装脚本
fi

echo "php-fpm7,redis and nginx started"

while true; do
    sleep 2
done