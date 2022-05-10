# **Kubernetes笔记**

> 本系列主要记录我在kubernetes学习和工作过程中的经验与总结


## **1 什么是Kubernetes**

kubernetes，也称为k8s，是Google开源的容器编排工具，发展了这么多年，已经是一套非常成熟的解决方案，可以用于自动化部署、扩展容器.
Kubernetes 是一个可移植、可扩展的开源平台，用于管理容器化工作负载和服务，有助于声明式配置和自动化。 它拥有庞大且快速发展的生态系统。 Kubernetes 服务、支持和工具随处可见。

> 随着微服务的快速发展，各大企业中的大部分业务都在逐步的做容器化，即 "虚机"--> "容器"，快速、方便的管理大规模的容器集群，对企业来说，是一个不小的挑战。Kubernetes应运而生，也快速的占领了市场，成为了大部分企业做容器管理的主要选择。对于运维开发人员来说，在当下的时代，Kubernetes已经成为一门必修课。


## **2 Kubernetes集群的安装和配置**

* **[使用rancher工具部署Kubernetes集群](/kubernetes/rancher)**
* **[使用kubeadm工具部署Kubernetes集群](/kubernetes/kubeadm)**



## 3 Kubernetes中的最小单元Pod



### **1 Pod基本使用**

* [Pod基本定义](kubernetes/Pod基本定义)
* Pod基本用法
* Pod的配置管理
* Pod生命周期
* Pod调度策略（重点）





## 4 kubernetes服务暴露机制

## 5 Kubernetes各组件工作原理
## 6 Kubernetes网络
## 7 Kubernetes存储
## 8 Kubernetes安全与权限
## 9 Kubernetes运维管理
## 10 Kubernetes与Devops
### Kubernetes集群容灾方案
- **[velero](kubernetes/velero)**