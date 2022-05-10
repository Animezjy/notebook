---
tags: 学习/运维技术/jenkins
---

## 目的
使用kubernetes中建立的jenkins-slave完成一些服务端的CI任务，减轻打包机负担，节约成本





## Kubernetes Cloud的配置说明

Jenkins使用Kubernetes Plugin连接Kubernetes集群并动态生成和释放Slave Pod。

1.  在左侧导航栏选择返回工作台。
2.  在Jenkins系统左侧导航栏选择系统管理。
3.  在管理Jenkins页面的系统配置下单击节点管理。
4.  在节点列表页面左侧导航栏选择Configure Clouds。
5.  在配置集群页面单击Kubernetes Cloud details...




以下为Kubernetes Cloud，以下为各个参数的具体说明：



|参数|说明|
|--|--|
|名称|![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204190948005.png)|
|kubernetes地址|填写对应集群的地址(https://172.16.153.108:6443)
|kubernetes命名空间|动态Slave Pod会在填写的命名空间下生成和销毁|
|jenkins地址|Slave Pod连接jenkins Master使用的服务节点|
在*配置集群*页面单击`Pod Templates`,配置pod模板
|参数|说明|
|--|--|
|名称|模板名称，Slave Pod会以此模板名作为pod名![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204190958435.png)|
|命名空间|与上面配置的保持一直即可|
|标签列表|jenkins构建任务通过此处配置的标签选择模板生成Slave Pod|
|容器列表|`jnlp` 用于连接Jenkins Master|![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204191002442.png)




CA证书
```crt
-----BEGIN CERTIFICATE-----
MIICwjCCAaqgAwIBAgIBADANBgkqhkiG9w0BAQsFADASMRAwDgYDVQQDEwdrdWJl
LWNhMB4XDTIxMDYxMTA4MTAzN1oXDTMxMDYwOTA4MTAzN1owEjEQMA4GA1UEAxMH
a3ViZS1jYTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALpW834LQ5Yn
KXGwiqOMW2xrwRhSwcIThl7lzxDbwBKv79fes36YkW1GO4GghRNl8wdgABhjK6h5
KF/imlpNAckBpYFu512GON2s0w+6lrn8Lgkozk51a5JVCsn5BSW6dFVeg8Lf98C2
K0IZA0t+GrwRJsiKJDPp44ye56gG4P38YpDK1ATKaqUi1kjOGeJYYzYCowJyVNQF
IY4OtAo1igR8O2ElzowyI5chWyzvrWLG1hYiE0+ThxbwzmEyonJ58bDyohzgKyNx
PLH2SelA0fr+FglpR5l7VgSUzokP2mzaQfuZavA3dyVBeFmYnEAE6p/aH2DcXfol
OYtv5LoJfC0CAwEAAaMjMCEwDgYDVR0PAQH/BAQDAgKkMA8GA1UdEwEB/wQFMAMB
Af8wDQYJKoZIhvcNAQELBQADggEBAASj+ZmwoKxyuMjOShlriuksLnzddB+2WEBP
mQHDxqQzLUxLTFAvN6oP+9V1HHIINA48feyWVhw3/NzPIdJaNnbAgXbzZCXmeve2
AmR+lxpqJFcywaxPVR5Th9p3a0Oy+5I5U8t/nceWmy2ebTuoBJoK8jU1HR3ZBzgj
nORrAR4UXfrOIlgc5Pbxpgl2+NlcEwkKNF1xn5kbjcv2B/Cycpp1h45/bVlAvDgo
yQjb+r1pffLP0fczqkXispOAXOrXB4xSHVZIeVNVVpYREj38Ek5JfDBrRXYNygNv
Z0iZZNN/MdFvC2yF0zWSupWnhxgWPSEoZVLfmy0y19CXTUxkt8g=
-----END CERTIFICATE-----
```


client crt
```crt
-----BEGIN CERTIFICATE-----
MIIC6TCCAdGgAwIBAgIIa1jX0o6jIXUwDQYJKoZIhvcNAQELBQAwEjEQMA4GA1UE
AxMHa3ViZS1jYTAeFw0yMTA2MTEwODEwMzdaFw0zMTA2MTQxMDIwMjlaMC4xFzAV
BgNVBAoTDnN5c3RlbTptYXN0ZXJzMRMwEQYDVQQDEwprdWJlLWFkbWluMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwXyA0OqJ1k3koiFAV4ezitgT55OM
W493VrXIMumqyEj8tbNcwmuleyFXjFY76aIpS7qaCujPk9eR40sJcNc5XX2O+haF
fXf7g7vl3ltoKmjweobt7vFdHrSbLQjxcBqxEgN2+veqT37Dc2N1e4XJvlneXTk7
AAXc1mtoVB5MQsnj6LVgFuEqf2CSYOTZaXWSQmYK90zR+Gh6YAmyO3W2J+1bPodO
UUInpilOevpuoluobp8XPa0FzX2qJYoOTwWwL+72i/VYPy3gA3sUh9P5mjfSjGPw
Ctp8tJ6CSHdCP/jPrsiIT5IUXHoVxWGoica9KnIVSKt1xZfxHDacqIYxBQIDAQAB
oycwJTAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDQYJKoZI
hvcNAQELBQADggEBABvW40AmNmLqgJcs6IWEABJ4DcA2pwACgjZgbFAK/7ve4mk3
T1NoQg6kH7lksQwgqQQlFGe9uE+AJ/i+lz/ovAf0dn3NzbhqdU21JLbT0VVEfFOM
l4qR/TkmlK9IPNS1gR6heltoF59TIT71fQ07Z4uFrwyA0fCTwFpxXLQ5HJwmfczH
ojz71TiInF6TOFXKlZTX7VEMMy7XIa4hHamil5LuOki1oUrbTe48GnN9BLqztvyI
4BTooW7qzptiS4WOmab9znzM8j4C/DXkpKE3gl5bL1xLEwGgPtxGKVGRE4eWkbxc
unOUhwmTbIC94ooccVfw3HJRRwvTchAlSVuwudE=
```



```shell
# 生成jenkins使用的PKCS12格式的cert.pfx文件，需要设置密码，注意密码后期jenkins需要

# openssl pkcs12 -export -out cert.pfx -inkey client.key -in client.crt -certfile ca.crt
Enter Export Password:
Verifying - Enter Export Password:

```


![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204131704703.png)



![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204131704386.png)



[jenkins 配置连接k8s 配置 cloud_我的喵叫初六的博客-CSDN博客_jenkins k8s](https://blog.csdn.net/weixin_38367535/article/details/120736935)

```shell
 kubectl create clusterrolebinding jenkins --clusterrole cluster-admin --serviceaccount=cicd-test:cicd-test
 kubectl create serviceaccount cicd-test
```



![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204181718128.png)



## 遇到的问题

Jenkins CI中 使用 Docker 运行构建节点也是使用的是docker in docker 的原理，通过jenkins-cci:agent容器内调用宿主机的docker daemon实现CI构建，在CI的WorkSpace中的Job里，若有使用将当前的工作路径挂载至容器内运行的时候，实际上是将宿主机对应的路径挂载至容器内。此时如果 jenkins-cci 的 agent容器内的目录与宿主机的目录路径不一致时，会导致在Job的容器内无法找到想要的文件，可能是一个空目录（可在宿主机找到对应的路径）


**docker in docker**
docker in docker是通过将宿主机的 docker.sock 挂载至容器内，实现共享宿主机的docker daemon； 在容器中使用docker image、docker pull、 docker push 实际上使用的是宿主机的docker daemon.




使用docker in docker的弊端：
1. 
2. 
3. 在Slave Pod中的




```grovvy
pipeline {
  agent {
    kubernetes {
      // 这里就是继承
      inheritFrom 'jenkins-slave'
      yaml '''
        apiVersion: v1
        kind: Pod
        metadata:
          labels:
            jenkins: slave-docker
        spec:
          containers:
          - name: maven
            image: maven:alpine
            command:
            - cat
            tty: true
          - name: golang
            image: golang:1.16.5
            command:
            - sleep
            args:
            - 99d
        '''
    }
  }
  stages {
    stage('Build'){
      steps {
        container('maven-jdk') {
          sh 'id;java -version'
        }
      }
    }
    stage('查看 golang 版本'){
      steps {
        container('golang') {
          sh 'go version'
        }
      }
    }
    stage('查看 maven 版本') {
      steps {
        container('maven') {
          sh 'id;mvn -version > maven'
        }
      }
    }
    stage('构建镜像'){
      steps {
        container('docker') {
          sh 'id;docker info > docker'
        }
      }
    }
  }
}

```




[jenkins-使用继承实现基于 kubernetes Pod 的多容器的多构建环境的 Jenkins Slave_shark_西瓜甜的博客-CSDN博客](https://blog.csdn.net/qq_22648091/article/details/118861845)





```shell
registry-dev.youle.game/ops/maven:3.6.0-jdk-11-python3

PIP_INDEX_URL
[404 - Nexus Repository Manager](http://nexus.youle.game/repository/pypi-public/simple)

PIP_TRUSTED_HOST
nexus.youle.game
```


```yaml
---
apiVersion: "v1"
kind: "Pod"
metadata:
  labels:
    jenkins: "slave"
    jenkins/label-digest: "8a745ffef33e2ef3dec6f353cdad88d65f1aa86a"
    jenkins/label: "backend-ci"
  name: "pipeline-backend-ci-mvdr5"
  namespace: "cicd-test"
spec:
  containers:
  - env:
    - name: "JENKINS_SECRET"
      value: "********"
    - name: "JENKINS_AGENT_NAME"
      value: "pipeline-backend-ci-mvdr5"
    - name: "JENKINS_NAME"
      value: "pipeline-backend-ci-mvdr5"
    - name: "JENKINS_AGENT_WORKDIR"
      value: "/home/jenkins/jenkins_home"
    - name: "JENKINS_URL"
      value: "[http://172.16.153.153:8080/](http://172.16.153.153:8080/)"
    image: "jenkins/jnlp-agent-maven"
    imagePullPolicy: "IfNotPresent"
    name: "jnlp"
    resources:
      limits: {}
      requests: {}
    tty: true
    volumeMounts:
    - mountPath: "/home/jenkins/jenkins_home"
      name: "volume-2"
      readOnly: false
    - mountPath: "/root/.m2"
      name: "volume-1"
      readOnly: false
    - mountPath: "/var/run/docker.sock"
      name: "volume-0"
      readOnly: false
    workingDir: "/home/jenkins/jenkins_home"
  - env:
    - name: "PIP_TRUSTED_HOST"
      value: "nexus.youle.game"
    - name: "PIP_INDEX_URL"
      value: "[http://nexus.youle.game/repository/pypi-public/simple](http://nexus.youle.game/repository/pypi-public/simple)"
    image: "registry-dev.youle.game/ops/maven:3.6.0-jdk-11-python3"
    imagePullPolicy: "Always"
    name: "maven-jdk"
    resources:
      limits: {}
      requests: {}
    tty: true
    volumeMounts:
    - mountPath: "/home/jenkins/jenkins_home"
      name: "volume-2"
      readOnly: false
    - mountPath: "/root/.m2"
      name: "volume-1"
      readOnly: false
    - mountPath: "/var/run/docker.sock"
      name: "volume-0"
      readOnly: false
    - mountPath: "/home/jenkins/workspace"
      name: "workspace-volume"
      readOnly: false
    workingDir: "/home/jenkins/workspace"
  hostNetwork: false
  nodeSelector:
    kubernetes.io/os: "linux"
  restartPolicy: "Never"
  serviceAccountName: "cicd-test"
  volumes:
  - hostPath:
      path: "/var/run/docker.sock"
    name: "volume-0"
  - hostPath:
      path: "/home/jenkins/jenkins_home"
    name: "volume-2"
  - name: "volume-1"
    persistentVolumeClaim:
      claimName: "jenkins-slave-pvc"
      readOnly: false
  - emptyDir:
      medium: ""
    name: "workspace-volume"
```





  Normal   ExternalProvisioning  7s (x3 over 34s)  persistentvolume-controller                                                                             waiting for a volume to be created, either by external provisioner "cephfs.csi.ceph.com" or manually created by system administrator
  Normal   Provisioning          4s (x7 over 34s)  cephfs.csi.ceph.com_csi-cephfsplugin-provisioner-7478d4d48f-qtwt4_dfccece0-c699-44df-a02a-5d6f75b54eec  External provisioner is provisioning volume for claim "subor-ci/pvc-workspace-subor-ci-wfs4k"
  Warning  ProvisioningFailed    4s (x7 over 34s)  cephfs.csi.ceph.com_csi-cephfsplugin-provisioner-7478d4d48f-qtwt4_dfccece0-c699-44df-a02a-5d6f75b54eec  failed to provision volume with StorageClass "csi-cephfs-sc": rpc error: code = InvalidArgument desc = missing ID field 'adminID' in secrets


