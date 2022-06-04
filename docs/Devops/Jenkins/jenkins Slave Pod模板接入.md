
#工作/攸乐/项目运维/pandora

## 需要做的工作
### 1. 构建运行CI任务需要的环境
### 2. 在对应的kubernetes集群中创建Slave Pod需要的资源

**namespace**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pandora-ci
  
---
apiVersion: v1
kind: Namespace
metadata:
  name: {{project}}-ci

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{project}}-mvn-pvc
  namespace: {{project}}-ci
spec:
  storageClassName: "csi-cephfs-sc"
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 5Gi


---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{project}}-ci
  namespace: {{project}}-ci

---

kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: {{project}}-ci
rules:
  - apiGroups: ["extensions", "apps"]
    resources: ["deployments"]
    verbs: ["create", "delete", "get", "list", "watch", "patch", "update"]
  - apiGroups: [""]
    resources: ["services"]
    verbs: ["create", "delete", "get", "list", "watch", "patch", "update"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["create","delete","get","list","patch","update","watch"]
  - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create","delete","get","list","patch","update","watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get","list","watch"]
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get"]

---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: {{project}}-ci
  namespace: {{project}}-ci
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: {{project}}-ci
subjects:
  - kind: ServiceAccount
    name: {{project}}-ci
    namespace: {{project}}-ci>)
```

> 注意将yaml中的变量名替换为项目名


### 3.Jenkins cloud configure中添加新项目
![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204241529418.png)


![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204251002078.png)

持久化maven cache
![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204251005241.png)
配置service account和工作空间卷
![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204251008903.png)

修改完之后，保存配置




### 4.修改Jenkinsfile，适配逻辑


新增`container`代码块，将原来的
```groovy

pipeline {
    agent {
        label 'pandora-ci'
    }
    stages {
        stage('Setup') {
            steps {
                ...
                container('maven-jdk') {
                    sh 'make -f _continuous_integration_delivery/Makefile setup'
                }
                ...
            }
        }
    }
}

```



7. 触发一个CI任务，测试验收








在配置时需要注意以下几点
1. 父模板名称
2. 



[Sign in · GitLab](https://git.youle.game/pandora/backend/server/-/merge_requests/566/diffs)- 


reslib 需要加密


