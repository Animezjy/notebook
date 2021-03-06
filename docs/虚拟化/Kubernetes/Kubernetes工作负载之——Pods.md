#学习/运维技术/kubernetes

# Pods
*Pod*是Kubernetes中创建和管理的最小可调度的单元。
*Pod*中可以包含一组（一个或多个）容器，这些容器共享存储、网络等资源。
我们也可以在Pod启动过程中向其注入一些其他调试用的容器。
Pod 类似于共享名字空间和文件系统卷的一组 Docker 容器。


## Pod的生命周期
|取值|描述|
|---|---|
|Pending|Kubernetes集群已经收到创建Pod的请求，但是有一个或多个容器尚未创建。这个阶段包括等待Pod被调度的时间和下载镜像的时间|
|Running|Pod已经绑定到了对应节点，Pod中的所有容器都已被创建。至少有一个容器在运行|
|Succeeded|Pod中的所有容器都已终止，并且不会再重启|
|Failed|Pod中的所有容器都已终止，至少有一个容器是因为失败|
|Unknown|与Pod所在主机通信失败|




## Pod探针
