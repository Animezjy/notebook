#学习/运维技术/kubernetes 
# **使用rke工具部署高可用k8s集群**



## **一、系统环境**

| 操作系统  | 主机名   | ip            | rke版本 | docker版本 |
| --------- | -------- | ------------- | ------- | ---------- |
| Centos7.9 | master01 | 172.16.111.11 | 1.2.6   | 19.03.8    |
| Centos7.9 | master02 | 172.16.111.12 | 1.2.6   | 19.03.8    |
| Centos7.9 | master03 | 172.16.111.13 | 1.2.6   | 19.03.8    |



## **二、基础环境配置**


### **1、修改主机名**

```shell
hostname set-hostname xxxx
```



### **2、安装工具**

#### **1、安装docker**

可以参考这篇文章
**[Centos安装docker](虚拟化/docker/Centos7安装docker)**

#### **2、安装rke**

*rke*是rancher官方提供的一套kubernetes安装程序，支持在多种类型的服务器上安装k8s

```shell
wget https://github.com/rancher/rke/releases/download/v1.2.6/rke_linux-amd64
chmod +x rke_linux-amd64
mv rke_linux-amd64 /usr/local/bin/
# 查看rke工具版本
rke_linux-amd64 --version
```


### **3、安装kubectl**

由于采用rke的方式部署集群，故需要单独安装kubectl，来用于和k8s集群通信

**[kubectl下载地址](https://storage.googleapis.com/kubernetes-release/release/v1.19.8/kubernetes-client-linux-amd64.tar.gz)**


```shell
wget https://storage.googleapis.com/kubernetes-release/release/v1.19.8/kubernetes-client-linux-amd64.tar.gz
tar -xf kubernetes-client-linux-amd64.tar.gz
cp /usr/src/kubernetes/client/bin/kubectl /usr/bin/kubectl
chmod +x /usr/local/bin/kubectl
```


### **4、配置主机环境**

!> 根据rancher官方的要求，使用`rke`安装`kubernetes`时，不能使用`root`用户，以下所有操作都在三台主机上操作


#### **1、创建用户rancher**

```shell
useradd rancher
passwd rancher
```



#### **2、为rancher用户授权docker使用权限**

```shell
# 将rancher用户加入到docker组中
gpasswd -a rancher docker
# 更新用户组
newgrp docker
```



**配置ssh免密登陆**

```shell
su - rancher
# 生成公钥文件
ssh-keygen #一路回车
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202205130911191.png)


将公钥拷贝到其他主机
```shell
ssh-copy-id 172.16.111.11
ssh-copy-id 172.16.111.12
ssh-copy-id 172.16.111.13
```



#### **3、添加rancher-cluster.yaml文件**

- *address* 节点ip
- *user* 可以运行docker的用户

- *internal_address* 内部集群通信的ip
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


## **三、安装Kubernetes集群**

### **1、安装集群**

!> 以下操作在`master01`上执行

```shell
# 使用rancher用户执行
rke_linux-amd64 up --config ./rancher-cluster.yaml
```


> 如果网络不好，可以提前把镜像下载下来


![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202205130920001.png)


如上图表示安装成功


### **2、设置kubectl**

在`master01`上操作

```
mkdir ~/.kube
cp kube_config_rancher-cluster.yaml ~/.kube/config
export KUBECONFIG=$(pwd)/kube_config_rancher-cluster.yml
```


### **3、验证**

```shell
kubectl get nodes
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202205130921300.png)


## **四、附录**

**生产用k8s，rke配置**

```yaml
nodes:
- address: 172.16.157.4
  port: "22"
  internal_address: "172.16.157.4"
  role: [controlplane,worker,etcd]
  hostname_override: amd-k8s01
  user: rancher
  docker_socket: /var/run/docker.sock
  ssh_key: ""
  ssh_key_path: ~/.ssh/id_rsa
  ssh_cert: ""
  ssh_cert_path: ""
  labels: {}
  taints: []
- address: 172.16.157.5
  port: "22"
  internal_address: "172.16.157.5"
  role: [controlplane,worker,etcd]
  hostname_override: amd-k8s02
  user: rancher
  docker_socket: /var/run/docker.sock
  ssh_key: ""
  ssh_key_path: ~/.ssh/id_rsa
  ssh_cert: ""
  ssh_cert_path: ""
  labels: {}
  taints: []
- address: 172.16.157.6
  port: "22"
  internal_address: "172.16.157.6"
  role: [controlplane,worker,etcd]
  hostname_override: amd-k8s03
  user: rancher
  docker_socket: /var/run/docker.sock
  ssh_key: ""
  ssh_key_path: ~/.ssh/id_rsa
  ssh_cert: ""
  ssh_cert_path: ""
  labels: {}
  taints: []
services:
  etcd:
    image: "rancher/hyperkube:v1.19.10-rancher1"
    extra_args: {}
    extra_binds: []
    extra_env: []
    win_extra_args: {}
    win_extra_binds: []
    win_extra_env: []
    external_urls: []
    ca_cert: ""
    cert: ""
    key: ""
    path: ""
    uid: 0
    gid: 0
    snapshot: null
    retention: ""
    creation: ""
    backup_config:
      enabled: true
      interval_hours: 6
      retention: 60
  kube-api:
    image: "rancher/hyperkube:v1.19.10-rancher1"
    extra_args: {}
    extra_binds: []
    extra_env: []
    win_extra_args: {}
    win_extra_binds: []
    win_extra_env: []
    service_cluster_ip_range: 10.47.0.0/16
    service_node_port_range: "20000-20767"
    pod_security_policy: false
    always_pull_images: true
    secrets_encryption_config: null
    audit_log: null
    admission_configuration: null
    event_rate_limit: null
    max-requests-inflight: 800
  kube-controller:
    image: "rancher/hyperkube:v1.19.10-rancher1"
    extra_args: {}
    extra_binds: []
    extra_env: []
    win_extra_args: {}
    win_extra_binds: []
    win_extra_env: []
    cluster_cidr: 10.46.0.0/16
    service_cluster_ip_range: 10.47.0.0/16
  scheduler:
    image: "rancher/hyperkube:v1.19.10-rancher1"
    extra_args: {}
    extra_binds: []
    extra_env: []
    win_extra_args: {}
    win_extra_binds: []
    win_extra_env: []
  kubelet:
    image: "rancher/hyperkube:v1.19.10-rancher1"
    extra_args:
      max-pods: '350'
      max-open-files: '2000000'
      kube-api-qps: '15'
    extra_binds: []
    extra_env: []
    win_extra_args: {}
    win_extra_binds: []
    win_extra_env: []
    cluster_domain: cluster.topjoy
    infra_container_image: ""
    cluster_dns_server: 10.47.0.10
    fail_swap_on: false
    generate_serving_certificate: false
  kubeproxy:
    image: "rancher/hyperkube:v1.19.10-rancher1"
    extra_args:
      kube-api-burst: 20
      kube-api-qps: 10
    extra_binds: []
    extra_env: []
    win_extra_args: {}
    win_extra_binds: []
    win_extra_env: []
network:
  plugin: flannel
  options: {}
  mtu: 0
  node_selector: {}
  update_strategy: null
  tolerations: []
authentication:
  strategy: x509
  sans: []
  webhook: null
addons: ""
addons_include: []
system_images:
  etcd: rancher/mirrored-coreos-etcd:v3.4.15-rancher1
  alpine: rancher/rke-tools:v0.1.74
  kubernetes: rancher/hyperkube:v1.19.10-rancher1
```