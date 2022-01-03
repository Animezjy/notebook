## Jenkins安装及使用

### 环境说明
- 操作系统：Centos7.9
- jenkins版本：2.314
### 安装
1. [安装docker](docker/README)
2. 使用docker拉取镜像

```shell
# 查询可用的jenkins镜像
docker search jenkins
```
![image-20211230151131252](https://gitee.com/animezjy/PicGo_img/raw/master/images/202112301511333.png)
这里我们使用`jenkins/jenkins`镜像

```shell
docker pull jenkins/jenkins
```
* 3. 创建数据持久化目录，启动容器
```shell
# 创建数据目录
mkdir -p /data/jenkins_home
chmod -R 777  /data/jenkins_home
# 启动容器
docker run -itd --name jenkins -p 8080:8080 -v /data/jenkins_home:/var/jenkins_home jenkins/jenkins
```
使用 `docker logs -f jenkins`可以查看容器日志，容器的数据会持久化到刚才创建的数据目录`/data/jenkins_home`中
![image-20211230151140129](https://gitee.com/animezjy/PicGo_img/raw/master/images/202112301511255.png)

