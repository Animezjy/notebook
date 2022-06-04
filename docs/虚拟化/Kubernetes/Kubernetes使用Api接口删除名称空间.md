
## 简介
在Kubernetes集群的使用过程中，发现无法通过*kubectl*删除名称空间，在此记录一下解决办法



# 打开一个终端，运行以下命令

```shell
kubectl proxy --port=8081
```


# 打开另一个终端

```shell
kubectl get ns cdi -o json >cdi.json
```


修改json中的spec字段
```json
    "spec": {
        "finalizers": [
        ]
    },
```

```shell
curl -k -H "Content-Type: application/json" -X PUT --data-binary @fleet-local.json http://127.0.0.1:8081/api/v1/namespaces/fleet-local/finalize
```

![](https://cdn.nlark.com/yuque/0/2021/png/12669195/1628062085126-6c80d499-f49a-49ac-963f-02e8c8d9208c.png)