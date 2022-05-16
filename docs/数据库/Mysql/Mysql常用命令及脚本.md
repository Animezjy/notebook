

### **1、Mysql主从状态检查脚本**
```shell
#!/bin/bash

# Author: Pegasus

# Date: 2020-08-12

# check mysql slave status

DATE=`date +"%Y-%m-%d %H:%M:%S"`

user=root

password=3XE30uIxE3M6go5PFD

STATUS=$(/data2/mysql5.7.24/bin/mysql -u$user  -p$password -S /tmp/mysql_3306.sock  -e "show slave status\G" | grep -i "

running")

IO_env=`echo $STATUS | grep IO | awk  ' {print $2}'`

SQL_env=`echo $STATUS | grep SQL | awk  '{print $4}'`

echo $IO_env

echo $SQL_env

if [ "${IO_env}" = "No" ]; then

  echo "slave Io process is DOWN"

  /data2/mysql5.7.24/bin/mysql -u$user -p$password -S /tmp/mysql_3306.sock -e "start slave;"

elif [ "{$SQL_env}"  = "No" ]; then

  echo "slave Io process is DOWN"

  /data2/mysql5.7.24/bin/mysql -u$user -p$password -S /tmp/mysql_3306.sock -e "start slave;"

else

  echo "slave Io process is OK"

fi
```