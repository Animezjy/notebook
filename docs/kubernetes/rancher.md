# **rke方式部署高可用k8s集群**



## **系统环境**



| 操作系统  | 主机名   | ip            | rke版本 | docker版本 |
| --------- | -------- | ------------- | ------- | ---------- |
| Centos7.9 | master01 | 172.16.111.11 | 1.2.6   | 19.03.8    |
| Centos7.9 | master02 | 172.16.111.12 | 1.2.6   | 19.03.8    |
| Centos7.9 | master03 | 172.16.111.13 | 1.2.6   | 19.03.8    |



## **准备工具**



**修改主机名**

```
hostname set-hostname xxxx
```



**安装docker**

**[Centos安装docker](docker/docker安装)**



**安装rke**

rke是rancher官方提供的一套kubernetes安装程序，支持在多种类型的服务器上安装k8s

```
wget https://github.com/rancher/rke/releases/download/v1.2.6/rke_linux-amd64
chmod +x rke_linux-amd64
mv rke_linux-amd64 /usr/local/bin/
# 查看rke工具版本
rke_linux-amd64 --version
```



**安装kubectl**

>  由于采用rke的方式部署集群，顾需要单独安装kubectl，来用于和k8s集群通信

**[kubectl下载地址](https://storage.googleapis.com/kubernetes-release/release/v1.19.8/kubernetes-client-linux-amd64.tar.gz)**



```
wget https://storage.googleapis.com/kubernetes-release/release/v1.19.8/kubernetes-client-linux-amd64.tar.gz
tar -xf kubernetes-client-linux-amd64.tar.gz
cp /usr/src/kubernetes/client/bin/kubectl /usr/bin/kubectl
chmod +x /usr/local/bin/kubectl
```



## **配置主机环境**

!> 根据rancher官方的要求，使用`rke`安装`kubernetes`时，不能使用`root`用户，以下所有操作都在三台主机上操作



**创建用户rancher**

```
useradd rancher
passwd rancher
```



**为rancher用户授权docker使用权限**

```
# 将rancher用户加入到docker组中
gpasswd -a rancher docker
# 更新用户组
newgrp docker
```



**配置ssh免密登陆**

```
su - rancher
# 生成公钥文件
ssh-keygen #一路回车
```

![image-20220106183708149](https://gitee.com/animezjy/PicGo_img/raw/master/images/202201061837387.png)



```
ssh-copy-id 172.16.111.11
ssh-copy-id 172.16.111.12
ssh-copy-id 172.16.111.13
```



**添加rancher-cluster.yaml文件**

- address 节点ip
- user 可以运行docker的用户

- internal_address 内部集群通信的ip
- 开启etcd备份机制，间隔6个小时，备份60天

```
nodes:
  - address: 172.16.111.11
    internal_address: 172.16.111.11
    user: rancher
    role: [controlplane,worker,etcd]
    hostname_override: master01
  - address: 172.16.111.12
    internal_address: 172.16.111.12
    user: rancher
    role: [controlplane,worker,etcd]
    hostname_override: master02
  - address: 172.16.111.13
    internal_address: 172.16.111.13
    user: rancher
    role: [controlplane,worker,etcd]
    hostname_override: master03

services:
  etcd:
    backup_config:
        enabled: true
        interval_hours: 6
        retention: 60
```



## **安装k8s集群**



在`master01`上执行

```
# 使用rancher用户执行
rke_linux-amd64 up --config ./rancher-cluster.yaml
```



> 如果网络不好，可以提前把镜像下载下来



![image-20220106183725608](https://gitee.com/animezjy/PicGo_img/raw/master/images/202201061837721.png)

如上图表示安装成功



**设置kubectl**

在`master01`上操作

```
mkdir ~/.kube
cp kube_config_rancher-cluster.yaml ~/.kube/config
export KUBECONFIG=$(pwd)/kube_config_rancher-cluster.yml
```



验证集群

```
kubectl get nodes
```

![image-20220106183736841](https://gitee.com/animezjy/PicGo_img/raw/master/images/202201061837961.png)

