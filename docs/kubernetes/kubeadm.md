# **使用kubeadm搭建k8s集群**



## **系统环境**

| 系统环境  | 主机ip        | 主机名   | k8s版本 |
| --------- | ------------- | -------- | ------- |
| Centos7.9 | 172.16.111.11 | master01 | 1.19.7  |
| Centos7.9 | 172.16.111.12 | master02 | 1.19.7  |
| Centos7.9 | 171.16.111.13 | master03 | 1.19.7  |



## **准备工作(需要在三台主机执行)**



**关闭selinux分区**

```
setenforce 0
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
```



**关闭交换分区**

```
swapoff -a
yes | cp /etc/fstab /etc/fstab_bak
cat /etc/fstab_bak |grep -v swap > /etc/fstab
```



**修改内核参数**

```
cat >> /etc/sysctl.conf<< EOF
# 每个网络接口接收数据包的速率比内核处理这些包的速率快时，允许送到队列的数据包的最大数目
net.core.netdev_max_backlog=10000

# 表示socket监听(listen)的backlog上限，也就是就是socket的监听队列(accept queue)，当一个tcp连接尚未被处理或建立时(半连接状态)，会保存在这个监听队列，默认为 128，在高并发
场景下偏小，优化到 32768。参考 https://imroc.io/posts/kubernetes-overflow-and-drop/
net.core.somaxconn=32768

# 没有启用syncookies的情况下，syn queue(半连接队列)大小除了受somaxconn限制外，也受这个参数的限制，默认1024，优化到8096，避免在高并发场景下丢包
net.ipv4.tcp_max_syn_backlog=8096

# 表示同一用户同时最大可以创建的 inotify 实例 (每个实例可以有很多 watch)
fs.inotify.max_user_instances=8192

# max-file 表示系统级别的能够打开的文件句柄的数量， 一般如果遇到文件句柄达到上限时，会碰到
# Too many open files 或者 Socket/File: Can’t open so many files 等错误
fs.file-max=2097152

# 表示同一用户同时可以添加的watch数目（watch一般是针对目录，决定了同时同一用户可以监控的目录数量) 默认值 8192 在容器场景下偏小，在某些情况下可能会导致 inotify watch 数量
耗尽，使得创建 Pod 不成功或者 kubelet 无法启动成功，将其优化到 524288
fs.inotify.max_user_watches=524288

net.core.bpf_jit_enable=1
net.core.bpf_jit_harden=1
net.core.bpf_jit_kallsyms=1
net.core.dev_weight_tx_bias=1

net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.ipv4.tcp_rmem=4096 12582912 16777216
net.ipv4.tcp_wmem=4096 12582912 16777216

net.core.rps_sock_flow_entries=8192

# 以下三个参数是 arp 缓存的 gc 阀值，相比默认值提高了，当内核维护的 arp 表过于庞大时候，可以考虑优化下，避免在某些场景下arp缓存溢出导致网络超时，参考：https://k8s.imroc.
io/avoid/cases/arp-cache-overflow-causes-healthcheck-failed

# 存在于 ARP 高速缓存中的最少层数，如果少于这个数，垃圾收集器将不会运行。缺省值是 128
net.ipv4.neigh.default.gc_thresh1=2048
# 保存在 ARP 高速缓存中的最多的记录软限制。垃圾收集器在开始收集前，允许记录数超过这个数字 5 秒。缺省值是 512
net.ipv4.neigh.default.gc_thresh2=4096
# 保存在 ARP 高速缓存中的最多记录的硬限制，一旦高速缓存中的数目高于此，垃圾收集器将马上运行。缺省值是 1024
net.ipv4.neigh.default.gc_thresh3=8192

net.ipv4.tcp_max_orphans=32768
net.ipv4.tcp_max_tw_buckets=32768

vm.max_map_count=262144

kernel.threads-max=30058

# 开启路由功能
net.ipv4.ip_forward=1

# 避免发生故障时没有 coredump
kernel.core_pattern=core
EOF
echo "1" > /proc/sys/net/bridge/bridge-nf-call-iptables
```



**安装docker环境**

**[Centos7部署docker](docker/docker安装)**



```
yum -y install containerd.io docker-ce-19.03.8 docker-ce-cli-19.03.8
systemctl enable docker && systemctl start docker
```



**修改docker Cgroup以及镜像源仓库**

```
# 修改docker cgroup为 systemd  如果不修改，在初始化k8s集群时会报错
sed -i "s#^ExecStart=/usr/bin/dockerd.*#ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd#g" /usr/lib/systemd/system/docker.service
# 修改docker镜像源
# ps: 如果可以上google 无需修改
cat >> /etc/docker/daemon.json<<EOF
{
  "registry-mirrors": [
        "https://1nj0zren.mirror.aliyuncs.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://registry.docker-cn.com"
    ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file":"5"
  }
}
EOF

systemctl daemon-reload
systemctl restart docker
```



**配置k8s的yum源**

```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
       http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```



**安装k8s工具**

```
yum -y install kubectl-1.19.7 kubeadm-1.19.7 kubelet-1.19.7
systemctl enable kubelet && systemctl start kubelet
```



**配置api-server的负载均衡（通过keepalived+haproxy）**

```
# 所有节点安装keepalived和haproxy
yum -y install haproxy keepalived
```



**haproxy配置（所有节点一致）**

```
#---------------------------------------------------------------------
# Example configuration for a possible web application.  See the
# full configuration options online.
#
#   http://haproxy.1wt.eu/download/1.4/doc/configuration.txt
#
#---------------------------------------------------------------------

#---------------------------------------------------------------------
# Global settings
#---------------------------------------------------------------------
global
    # to have these messages end up in /var/log/haproxy.log you will
    # need to:
    #
    # 1) configure syslog to accept network log events.  This is done
    #    by adding the '-r' option to the SYSLOGD_OPTIONS in
    #    /etc/sysconfig/syslog
    #
    # 2) configure local2 events to go to the /var/log/haproxy.log
    #   file. A line like the following can be added to
    #   /etc/sysconfig/syslog
    #
    #    local2.*                       /var/log/haproxy.log
    #
    log         127.0.0.1 local2

    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon

    # turn on stats unix socket
    stats socket /var/lib/haproxy/stats

#---------------------------------------------------------------------
# common defaults that all the 'listen' and 'backend' sections will
# use if not designated in their block
#---------------------------------------------------------------------
defaults
    mode                    http
    log                     global
    option                  httplog
    option                  dontlognull
    option http-server-close
    option forwardfor       except 127.0.0.0/8
    option                  redispatch
    retries                 3
    timeout http-request    10s
    timeout queue           1m
    timeout connect         10s
    timeout client          1m
    timeout server          1m
    timeout http-keep-alive 10s
    timeout check           10s
    maxconn                 3000

#---------------------------------------------------------------------
# main frontend which proxys to the backends
#---------------------------------------------------------------------
frontend  kubernetes-apiserver
    mode                        tcp
    bind                        *:16443
    option                      tcplog
    default_backend             kubernetes-apiserver

#---------------------------------------------------------------------
# static backend for serving up images, stylesheets and such
#---------------------------------------------------------------------
listen stats
    bind            *:1080
    stats auth      admin:awesomePassword
    stats refresh   5s
    stats realm     HAProxy\ Statistics
    stats uri       /admin?stats

#---------------------------------------------------------------------
# round robin balancing between the various backends
#---------------------------------------------------------------------
backend kubernetes-apiserver
    mode        tcp
    balance     roundrobin
    server  master1 172.16.111.11:6443 check
    server  master2 172.16.111.12:6443 check
    server  master3 172.16.111.13:6443 check
```



**master01 keepalived**

```
! Configuration File for keepalived

global_defs {
   router_id LVS_DEVEL

# 添加如下内容
   script_user root
   enable_script_security
}



vrrp_script check_haproxy {
    script "/etc/keepalived/check_haproxy.sh"
    interval 3
    weight -2
    fall 10
    rise 2
}



vrrp_instance VI_1 {
    state MASTER
    interface ens33
    virtual_router_id 51
    priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        172.16.111.200
    }
    track_script {
        check_haproxy     
    }
}
```



**master02 keepalived**



```
! Configuration File for keepalived

global_defs {
   router_id LVS_DEVEL

# 添加如下内容
   script_user root
   enable_script_security
}



vrrp_script check_haproxy {
    script "/etc/keepalived/check_haproxy.sh"
    interval 3
    weight -2
    fall 10
    rise 2
}



vrrp_instance VI_1 {
    state BACKUP
    interface ens33
    virtual_router_id 51
    priority 99
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        172.16.111.200
    }
    track_script {
        check_haproxy
    }
}
```



**master03 keepalived**

```
! Configuration File for keepalived

global_defs {
   router_id LVS_DEVEL

# 添加如下内容
   script_user root
   enable_script_security
}



vrrp_script check_haproxy {
    script "/etc/keepalived/check_haproxy.sh"
    interval 3
    weight -2
    fall 10
    rise 2
}



vrrp_instance VI_1 {
    state BACKUP
    interface ens33
    virtual_router_id 51
    priority 98
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        172.16.111.200
    }
    track_script {
        check_haproxy
    }
}
```



**/etc/keepalived/check_haproxy.sh**

```
#!/bin/sh
# HAPROXY down
A=`ps -C haproxy --no-header | wc -l`
if [ $A -eq 0 ]
then
systmectl start haproxy
if [ ps -C haproxy --no-header | wc -l -eq 0 ]
then
killall -9 haproxy
echo "HAPROXY down" | mail -s "haproxy"
sleep 3600
fi

fi
```



**启动服务**

```
chmod +x /etc/keepalived/check_haproxy.sh
systemctl enable haproxy && systemctl start haproxy
systemctl enable keepalived && systemctl start keepalived
```



##  **初始化集群**

```
# 在master01上操作
# 替换 apiserver.demo 为 您想要的 dnsName
export APISERVER_NAME=apiserver
echo "127.0.0.1    ${APISERVER_NAME}" >> /etc/hosts

cat <<EOF > ./kubeadm-config.yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: 172.16.111.11     # 本机IP
  bindPort: 6443
nodeRegistration:
  criSocket: /var/run/dockershim.sock
  name: master01        # 本主机名
  taints:
  - effect: NoSchedule
    key: node-role.kubernetes.io/master
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta2
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controlPlaneEndpoint: "172.16.111.200:16443"    # 虚拟IP和haproxy端口
controllerManager: {}
dns:
  type: CoreDNS
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: k8s.gcr.io    # 镜像仓库源要根据自己实际情况修改
kind: ClusterConfiguration
kubernetesVersion: v1.19.7    # k8s版本
networking:
  dnsDomain: luvyw.com
  podSubnet: "10.244.0.0/16"
  serviceSubnet: 10.96.0.0/12
scheduler: {}
EOF
```



**执行初始化集群命令**

```
# 在master01节点执行
kubeadm init --config=kubeadm-config.yaml --upload-certs
```



**去除master节点的污点**

```
# 去除污点，使master上也可运行pod
kubectl taint nodes master01 node-role.kubernetes.io/master:NoSchedule-
kubectl taint nodes master01 node.kubernetes.io/not-ready:NoSchedule-
```



**安装calico网络插件**

> kubernetes支持的网络插件很多，这里只是选择其中一种

```
wget https://kuboard.cn/install-script/calico/calico-3.9.2.yaml
# 修改calico-3.9.2.yaml 将CALICO_IPV4POOL_CIDR清空/或者配置成和SUBNET相同的网段
kubectl apply -f calico-3.9.2.yaml
```

至此，k8s一个节点初始化成功



**其余master节点运行加入集群命令**

```
# master02 和master03上操作
kubeadm join 172.16.111.200:16443 --token nsujl2.nfpvznx0pb0ziry8     --discovery-token-ca-cert-hash sha256:4c419c8e8c37404637e851a73edda20d87a162172b70a64a0f1316c4d217103c     --control-plane --certificate-key d57550a1be2c9c239fdaec2e42dc7475d72f255f0068be459129a2bd136de95c
```

> 如果忘记命令 可以使用 kubeadm token create --print-join-command来获取加入集群的命令



```
# 给另外两个节点取消污点，使得可以被调度
kubectl taint nodes master02 node-role.kubernetes.io/master:NoSchedule-

kubectl taint nodes master02 node-role.kubernetes.io/master:NoSchedule-
```



## **k8s常用命令**



**获取添加node节点的token**

```
kubeadm create token --print-join-command
```



**给节点添加角色标签**

```
kubectl label nodes master02 node-role.kubernetes.io/node=node
```



**k8s删除节点**

```
kubectl delete node xxx
```



**添加master节点**

```
#初始化获取证书
kubeadm init phase upload-certs --experimental-upload-certs

I0313 20:23:00.559871   28333 version.go:248] remote version is much newer: v1.17.4; falling back to: stable-1.14
[upload-certs] Storing the certificates in ConfigMap "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
a4786889248af30b616aa8307968e56007b9be1821fefe922e040f6e5e85f5f4

# 获取他添加node节点的token
kubeadm token create --print-join-command

kubeadm join apiserver.cluster.local:6443 --token 53e01r.qgkiaw0u5x72cuu1     --discovery-token-ca-cert-hash sha256:9e3e902497b8ab6c4e9111482aaed5a094013e00ff3f0d68f5489078480df3cf




# 将上面的两条命令结果进行拼接，在要添加的节点上执行
kubeadm join apiserver.cluster.local:6443 --token 53e01r.qgkiaw0u5x72cuu1     --discovery-token-ca-cert-hash sha256:9e3e902497b8ab6c4e9111482aaed5a094013e00ff3f0d68f5489078480df3cf \
--experimental-control-plane --certificate-key a4786889248af30b616aa8307968e56007b9be1821fefe922e040f6e5e85f5f4
```


