---
tags: 学习/运维技术/数据库/mongodb
---

mongodb内存大小分配原则：`内存大小>索引+热数据+连接占用内存`



## mongodb和内存相关的操作

查看索引大小情况
```sql
replica_set_1:PRIMARY> db.stats();
{
	"db" : "pandora_10001",    // 数据库名称
	"collections" : 5,         // 当前有几张表
	"views" : 0,               // 视图
	"objects" : 10000,         // 所有的表中的数据 1w条
	"avgObjSize" : 9608.0066,  // 平均每条数据的大小
	"dataSize" : 96080066,     // 总数据大小   91MB
	"storageSize" : 31387648,  // 所有数据占当前磁盘的大小
	"numExtents" : 0,   
	"indexes" : 12,            // 索引数量
	"indexSize" : 835584,      // 索引大小  816KB
	"scaleFactor" : 1,
	"fsUsedSize" : 8096239616,
	"fsTotalSize" : 42139451392,
	"ok" : 1,
}
```

查看内存占用情况
```sql
replica_set_1:PRIMARY> db.serverStatus().mem
{
    "bits": 64,
    "resident": 387,     // 物理内存使用情况  单位M
    "virtual": 1958,     // 虚拟内存使用情况
    "supported": true    // 是否支持扩展内存
}
```

查看mongodb当前的连接数
```sql
replica_set_1:PRIMARY> db.serverStatus().connections;
{
    "current": 12,        // 当前连接数
    "available": 52416,   // 可用连接数
    "totalCreated": 26,
    "active": 1
}
```

MongoDB释放内存的命令  
```sql
mongo> use admin
mongo> db.runCommand({closeAllDatabases:1})
```


### 修改mongodb使用的内存大小

官方文档介绍，从3.4版本开始，默认情况下，**WieldGigd内部缓存将使用下面2种中更大的一种：50% of (RAM - 1 GB) 和256 MB**
![](https://gitee.com/animezjy/PicGo_img/raw/master/images/202203251146057.png)
1. 修改配置文件中的`storage.wiredTiger.engineConfig.cacheSizeGB`字段


*/etc/mongod.conf*
```conf
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
storage:
  dbPath: /var/lib/mongo
  journal:
    enabled: true
  wiredTiger:
    engingConfig:
      cacheSizeDB: 0.02
# (8 - 1 Gb) * 0.15 = 1.05
```
经过测试，mongodb的内存稳定到了1G左右

2. 添加启动参数`--wiredTigerCacheSizeGB`
```shell
/usr/bin/mongod --quiet -f /etc/mongod.conf --wiredTigerCacheSizeGB 0.2 run # 这里的0.2是具体要占用的值而不是百分比
```


相关链接
[mongodb官方文档](https://www.mongodb.com/docs/v4.2/reference/parameters/#wiredtiger-parameters)
[博客园](https://www.cnblogs.com/lemon-flm/p/10876492.html)