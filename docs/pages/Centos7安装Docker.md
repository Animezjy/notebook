---
tags: 学习/运维技术/docker
---

# Centos7安装docker

## 一、Docker简介

docker是一个基于Go语言开发的容器引擎，它可以让我们快速的将应用打包到一个可移植的容器中，快速的发布到各个平台上。

docker有以下特点：
- 快速交付
- 跨平台
- 在同一硬件上可以运行多个容器
[docker官网](https://www.docker.com)

## 二、安装前检查环境
docker官方要求：在Linux上安装docker时，内核版本要求3.10以上
## 三、配置
## 四、安装xx
## 五、配置
## 六、验证




!> 版权声明：本文档中内容均为原创，转载请注明出处。





> docker也是目前主流容器平台kubernetes默认支持的引擎



## **docker的安装**
### **环境**

| 系统环境  | 主机名   | docker  |
| --------- | -------- | ------- |
| Centos7.9 | master01 | 19.03.8 |

### **卸载旧版docker**

```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

### **安装docker**

安装epel源

```
yum -y install epel-release
```

安装相关依赖包

```
yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

设置docker源

```
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

安装docker

```
yum -y install docker-ce-19.03.8 docker-ce-cli containerd.io
```

启动docker

```
systemctl enable docker   # 设置开机启动
systemctl start docker
```

设置docker仓库源

由于在国内，访问国外镜像站速度缓慢，因此可更换docker的镜像源为国内

```
mkdir -p /etc/docker
cat >> /etc/docker/daemon.json << EOF
{
    "registry-mirrors": [
        "https://1nj0zren.mirror.aliyuncs.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://registry.docker-cn.com"
    ]
}
EOF
# 设置完成后需要重新加载daemon 并重启docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker
```



将docker授权给普通用户

```shell
gpasswd -a user00 docker
newgrp docker
```






