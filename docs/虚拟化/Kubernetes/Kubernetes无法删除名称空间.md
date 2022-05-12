
```shell
$ kubectl get ns

ace-ace-36-0008         Active        5d17h
ace-ace-36-111          Terminating   45h
ace-ace-36-8            Active        5d17h
ace-ace-89-200          Active        41h
ace-ace-89-201          Active        41h
ace-ace-89-202          Active        41h
ace-ace36-0008          Active        5d17h
ace-ace36-111           Terminating   45h
ace-ace36-112           Terminating   45h
ace-ace36-113           Terminating   45h
ace-ace36-114           Terminating   45h
ace-ace36-115           Terminating   45h
```

查看命名空间下的资源
```shell

kubectl api-resources -o name --verbs=list --namespaced | xargs -n 1 kubectl get --show-kind --ignore-not-found -n test1


# 命令返回结果出现报错
error: unable to retrieve the complete list of server APIs: metrics.k8s.io/v1beta1: the server is currently unable to handle the request


Warning: extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress


```

查找出有问题的*apiservice*

```shell
root@amd-k8s03:~# kubectl get apiservice
NAME                                   SERVICE                      AVAILABLE                  AGE
v1.                                    Local                        True                       58d
v1.admissionregistration.k8s.io        Local                        True                       58d
v1.apiextensions.k8s.io                Local                        True                       58d
v1.apps                                Local                        True                       58d
v1.authentication.k8s.io               Local                        True                       58d
v1.authorization.k8s.io                Local                        True                       58d
v1.autoscaling                         Local                        True                       58d
v1.batch                               Local                        True                       58d
v1.certificates.k8s.io                 Local                        True                       58d
v1.coordination.k8s.io                 Local                        True                       58d
v1.events.k8s.io                       Local                        True                       58d
v1.networking.k8s.io                   Local                        True                       58d
v1.rbac.authorization.k8s.io           Local                        True                       58d
v1.scheduling.k8s.io                   Local                        True                       58d
v1.storage.k8s.io                      Local                        True                       58d
v1.topjoy.com                          Local                        True                       54d
v1beta1.admissionregistration.k8s.io   Local                        True                       58d
v1beta1.apiextensions.k8s.io           Local                        True                       58d
v1beta1.authentication.k8s.io          Local                        True                       58d
v1beta1.authorization.k8s.io           Local                        True                       58d
v1beta1.batch                          Local                        True                       58d
v1beta1.certificates.k8s.io            Local                        True                       58d
v1beta1.coordination.k8s.io            Local                        True                       58d
v1beta1.discovery.k8s.io               Local                        True                       58d
v1beta1.events.k8s.io                  Local                        True                       58d
v1beta1.extensions                     Local                        True                       58d
v1beta1.metrics.k8s.io                 kube-system/metrics-server   False (MissingEndpoints)   58d
v1beta1.networking.k8s.io              Local                        True                       58d
v1beta1.node.k8s.io                    Local                        True                       58d
v1beta1.policy                         Local                        True                       58d
v1beta1.rbac.authorization.k8s.io      Local                        True                       58d
v1beta1.scheduling.k8s.io              Local                        True                       58d
v1beta1.storage.k8s.io                 Local                        True                       58d
v2beta1.autoscaling                    Local                        True                       58d
v2beta2.autoscaling                    Local                        True                       58d
```

删除状态错误的apiservice
```shell
$ kubectl delete apiservice v1beta1.metrics.k8s.io
apiservice.apiregistration.k8s.io "v1beta1.metrics.k8s.io" deleted
```

再次查看ns
```shell
$ kubectl get ns
```



发现命名空间无法正常删除，我在查看名称空间下的资源时，收到了下面的报错
```shell
error: unable to retrieve the complete list of server APIs: metrics.k8s.io/v1beta1: the server is currently unable to handle the request
```


在通过


## 参考链接
[K8S从懵圈到熟练 - 我们为什么会删除不了集群的命名空间？-阿里云开发者社区](https://developer.aliyun.com/article/710206)












切换步骤
1. CI仓库         合并devops_test分支到dev分支
2. （CD仓库）pandora-pipeline 合并test_jdk17到 master分支
3. 服务器软链接切换（将jdk的指向由11指向17）  