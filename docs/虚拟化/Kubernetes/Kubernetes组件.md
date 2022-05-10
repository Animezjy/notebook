---
tags: 学习/运维技术/kubernetes
---

一个Kubernetes集群由一组节点组成。这些节点上运行Kubernetes所管理的容器化应用。每个Kubernetes集群至少有一个节点。

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202205071455113.png)

## 控制平面组件
控制平面组件是Kubernetes中的决策组件，他们负责检测和响应集群时间，可以通俗的理解为集群的*管家*。控制平面的组件可以在任意一个节点上运行
### kube-apiserver
该组件提供了Kubernetes API

### etcd
etcd是一个强一致性、高可用的键值对数据库，Kubernetes用它来保存所有集群数据。

### kube-scheduler
负责监视新创建的、未指定运行节点的Pods，选择节点让Pod运行。

### kube-controller-manager
集群控制器，通过kube-apiserver监控到集群当前的状态，致力于将当前状态转变为期望的状态
* 节点控制器
* 任务控制器
* 端点控制器
* 服务账户和令牌控制器


## Node组件

### kubelet
在一个Kubernetes集群中每个节点上运行的代理。该组件主要负责所有的容器都运行在Pod中。

### kube-proxy
每个节点上运行的网络代理，实现[Kubernetes service](/pages/Kubernetes服务)的一部分
kube-proxy 负责维护节点上的网络规则

### 容器运行时
容器运行时是负责容器运行的软件
Kubernetes支持容器的容器运行时包括[Docker](/pages/docker)




### 插件
插件使用Kubernetes资源实现集群功能，常见的有DNS、网络插件等
[官方文档](https://kubernetes.io/zh/docs/concepts/cluster-administration/addons/)
* DNS：用于配置各个节点上的kubelet，通知kubelet集群中DNS服务的IP地址，kubelet在启动容器时再将DNS服务器的地址通知到容器，容器使用该DNS服务器进行域名解析。
* 网络插件
    * calico
    * flannel
    * .....

......