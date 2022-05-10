---
tags: 学习/运维技术/docker
---

#### 镜像相关

查看镜像
```shell
docker images # 列出所有镜像
docker images -q # 只打印id

docker images|awk 'NR>1{image=$1":"$2;print image}' # 打印镜像名和版本号
```
删除镜像
```shell
docker rmi xxx
```



#### 容器相关

启动容器
```shell
docker run -itd --name nginx nginx:1.15
```

查看当前启动的容器
```shell
docker ps 
```

查看所有容器
```shell
docker ps -a
```



查看容器日志输出
```shell
# Usage:  docker logs [OPTIONS] CONTAINER

$ docker logs --help
Fetch the logs of a container

--since : 只输出指定日期之后的日志
--until : 输出指定日期之前的日志
-f      : 实时查看日志
-t      : 查看日志产生的日期


# eg
$ docker logs -f -t --since="2022-03-23" --tail 10 nginx-download
```
