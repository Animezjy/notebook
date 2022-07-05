---
tags: 学习/运维技术/数据库/mongodb
---

使用mongodump备份全量数据
```shell
mongodump -h 10.30.50.126:27017  -o /data/home/user00/mongo_data  -u siteRootAdmin -p mongodb_password --authenticationDatabase admin
```


恢复数据

```shell
mongorestore -d pandora_10001 --dir mongo_data/pandora_10001/  -u siteRootAdmin -p 'mongodb_password' --authenticationDatabase=admin
```



mongorestore  -d pandora_world --dir /tmp/mongo_data/pandora_world -u username -p 'password' --authenticationDatabase=admin


mongorestore  -d pandora_global --dir /tmp/mongo_data/pandora_global -u username -p 'password' --authenticationDatabase=admin