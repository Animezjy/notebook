---
tags: 学习/运维技术/版本管理/gitlab
---
## 备份
1. 全量备份

gitlab官方建议的方式是使用自带的`gitlab-rake`命令进行备份
使用该命令进行备份，会在gitlab的数据目录下`/var/opt/gitlab/backups`创建一个压缩包
```shell
gitlab-rake gitlab:backup:create
```
