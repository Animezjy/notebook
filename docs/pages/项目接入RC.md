## 简介

新项目在接入RC时，运维需要做的事情

## 步骤

### 1. 新建RC数据库

  

ssh 172.16.153.136
# 登录数据库
mysql -h 127.0.0.1 -u root -P51000 -p'!1234Qwer'

  

# 创建数据库并授权
create database seeker_resource_center charset=utf8;
grant all on seeker_resource_center to 'seekerrc'@'%' identified by 'Pr3_5c89eH';

  

**创建表结构**

  

CREATE TABLE `db_files` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(100) NOT NULL,
  `original_path` varchar(512) NOT NULL,
  `build_module_id` int(11) NOT NULL,
  `size` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `index_module` (`build_module_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16124554 DEFAULT CHARSET=utf8

  

CREATE TABLE `db_jenkins` (
  `jenkins_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `jenkins_build_url` varchar(100) NOT NULL,
  `jenkins_task_name` varchar(100) NOT NULL,
  `jenkins_build_start_time` datetime NOT NULL,
  `jenkins_build_end_time` datetime NOT NULL,
  `jenkins_build_status` varchar(20) NOT NULL,
  `jenkins_build_triggered_by` varchar(100) NOT NULL,
  PRIMARY KEY (`jenkins_id`),
  KEY `index_name` (`jenkins_task_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4919 DEFAULT CHARSET=utf8

  

CREATE TABLE `db_modules_built` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module_name` varchar(20) NOT NULL,
  `repo_type` varchar(10) DEFAULT NULL,
  `tag` varchar(100) NOT NULL,
  `profile_name` varchar(100) NOT NULL,
  `profile_content` varchar(10240) DEFAULT NULL,
  `jenkins_id` int(11) NOT NULL,
  `finished` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `index_tag_module_profile` (`tag`,`module_name`,`profile_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4908 DEFAULT CHARSET=utf8

  

参考文档：  
[Resource Center数据库设计](https://topjoy.yuque.com/tsd/services/euuo0a)

### 2. 配置apollo

在apollo中的`walle/walle`下创建新项目，并配置相关信息  
![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/20220406231202.png)


### 3. nas上创建对应目录，开启rsync
  

**nas上创建对应目录**

![](https://cdn.nlark.com/yuque/0/2022/png/12669195/1649257693446-a996a344-19b9-4b85-bcbd-c556cbc26348.png)

**开启rsync**

  

ssh admin@172.16.149.150

  

**修改rsync配置**

```ini
...
[seeker]
path = /volume1/rc_storage/seeker/
ignore errors
incoming chmod = Du=rwx,Dog=rx,Fu=rw,Fgo=r
secrets file = /volume1/rc_storage/seeker/.rsync/secrets/seeker.rsyncd.secrets
auth users = seeker
...
```

**创建密钥文件**

```shell
echo "seeker:Fa_bK1iT9" >> /volume1/rc_storage/seeker/.rsync/secrets/seeker.rsyncd.secrets
chmod 600 /volume1/rc_storage/seeker/.rsync/secrets/seeker.rsyncd.secrets
```


### 4. 登录RC HTTP服务器，挂载数据目录

  
```shell
ssh 172.16.153.40
mkdir /rc-download-data/seeker
mount -t nfs -o vers=3 172.16.149.150:/volume1/rc_storage/seeker           /rc-download-data/seeker
```
  

需要在`172.16.153.58`上的相同目录下手动挂载下项目目录

### 5. 修改RC服务的配置文件，重启服务

修改docker-compose配置文件

  

      - /rc-download-data/seeker:/usr/share/nginx/html/download/seeker
      - /rc-download-data/seeker:/usr/share/nginx/html/seeker
      - ./auth_file/auth_seeker:/usr/share/nginx/html/auth_seeker:ro

  

创建auth认证文件

  

htpasswd -c auth_seeker seeker

  

RC HTTP用户的密码不能手动配置，需要通过代码生成  
参考：[Jenkins RC HTTP账户](https://topjoy.yuque.com/tsd/qrpg8g/aresd3)

  

nginx新增配置

  

    location /seeker {
        auth_basic "seeker";
        auth_basic_user_file /usr/share/nginx/html/auth_seeker;
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        autoindex on;
        fancyindex on;
        fancyindex_exact_size off;
        fancyindex_localtime  on;
    }

  

重新启动docker-compose

  
```shell
docker-compose down;docker-compose up -d
```
  

### 6. 配置域名解析

  

登录power-dns页面，配置域名解析

![](https://cdn.nlark.com/yuque/0/2022/png/12669195/1649256886699-ebe77b8d-5cac-43fd-b76e-869d5712e420.png)


```shell
jenkinsrc-seeker.youle.game  ---> 172.16.149.150
```
  

### CheckList

  
- [ ] 访问 [https://jenkinsrc.youle.game/seeker](https://jenkinsrc.youle.game/seeker)，通过账号名密码可以正常登录
- [ ] 通过[https://jenkinsrc.youle.game/download/seeker/test.txt](https://jenkinsrc.youle.game/download/seeker/test.txt)，可以查看到测试文件
- [ ] 使用rsync可以正常上传/下载对应项目上的文件