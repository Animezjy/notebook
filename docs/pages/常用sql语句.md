---
tags: 学习/运维技术/数据库
---

* SQL查询重复数据并列出重复数据
```sql
select * from "version_c-785" where md5 in (  

select md5 from "version_c-785"  

group by md5  

having count(md5) > 1  

) order by md5
```


```
select md5,count(*) as count from "version_c-785" group by md5 having count>1;   
```