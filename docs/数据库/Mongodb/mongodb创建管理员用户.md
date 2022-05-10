---
tags: 学习/运维技术/数据库/mongodb
---
```sql

db.createUser({

 user : 'siteRootAdmin',

 pwd : 'mongodb_password',

 roles : [

 'clusterAdmin',

 'dbAdminAnyDatabase',

 'userAdminAnyDatabase',

 'readWriteAnyDatabase'

 ]

})

```