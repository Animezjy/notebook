<br>

<span id="busuanzi_container_site_pv" style='display:none'>
    👀 本站总访问量：<span id="busuanzi_value_site_pv"></span> 次
</span>
<span id="busuanzi_container_site_uv" style='display:none'>
    | 🚴‍♂️ 本站总访客数：<span id="busuanzi_value_site_uv"></span> 人
</span>

<br>
## 背景

公司目前使用的kubernetes集群是使用rancher搭建的，rancher提供了一套基于etcd的备份方案，在其他维度一直没有好的容灾解决方案，为了提高系统的可用性，也为了防止运维人员误操作，需要对命名空间级别资源实现资源备份

## velero简介

Velero是Heptio Ark公司（现已经被VMware收购）维护的一套kubernetes的集群备份、迁移工具。提供的主要功能如下：




velero使用对象存储保存kubernetes集群资源，默认支持AWS、Azure、GCP、兼容S3协议，也可以通过插件来扩展到其他平台（例如阿里云）

[官方文档](https://velero.io/docs/v1.6/) 
<br>
[github地址](https://github.com/vmware-tanzu/velero)



## Velero工作原理


![velero工作流程](https://gitee.com/animezjy/PicGo_img/raw/master/images/20210826232248.png)

velero中的操作都是一个自定义资源，通过在kubernetes中的自定义资源（CRD）定义并存储在etcd中。另外velero还自己实现了对自定义资源进行备份、恢复相关的控制器，也就是说，我们可以利用velero来备份、恢复kubernetes集群中的所有对象，也可以按照类型、名称空间或者标签来过滤对象



### 备份步骤

- 1，velero客户端调用kubernetes API服务创建备份对象（backuop）
- 2，backupController监听到backup对象，开始验证
- 3，backupController开始备份

- - 1，向kubernetes API请求，收集要备份的数据
  - 2，调用对象服务存储服务上传备份文件		





## velero安装

**环境要求**

- kubernetes版本1.12+
- 本地安装了kubectl工具
- 指定一个对象存储源

> Velero使用对象存储来存储备份和相关的资源，在安装之前需要提前准备一个对象存储，创建好存储桶

 如果没有对象存储，可以使用`MinIO` 解决方案。   

MINIO是一个开源的 S3 兼容对象存储系统，可以安装在本地并与 Velero 兼容。

MINIO地址：https://min.io/

velero可以部署在kubernetes集群内部，也可以在外部，本文中展示velero在kubernetes内部的部署方案，其他部署方式可以参考官方文档	



### 安装步骤(在kubernetes内部安装velero)



**安装MINIO对象存储**

在velero的官方github仓库中给出了测试文件，可以方便的部署MINIO，本文中采用这种方式

```
# 将velero仓库克隆到本地，之后运行示例文件
$ kubectl apply -f examples/minio/00-minio-deployment.yaml
```

**准备认证文件**

在本地需要创建对象存储的连接认证文件

```shell
cat >> credentials-velero <<EOF
[default]
aws_access_key_id=minio
aws_secret_access_key = minio123
EOF
```

**准备velero镜像**

```
$ docker pull velero/velero:v1.6.3
```

**准备插件镜像**

本文中使用的对象存储为MINIO，需要安装对应的插件

```
$ docker pull velero/velero-plugin-for-aws:1.2.0
```

**开始安装velero**



在官方的[github仓库](https://github.com/vmware-tanzu/velero/releases)中下载对应版本的velero安装工具

```
$ wget https://github.com/vmware-tanzu/velero/releases/download/v1.6.3/velero-v1.6.3-linux-amd64.tar.gz
```

安装velero服务

```
velero install --namespace velero \
--use-restic \
--image velero/velero:v1.6.3 \
--provider aws --bucket velero \
--plugins velero/velero-plugin-for-aws:v1.2.0 \
--secret-file ./credentials-velero  \
--backup-location-config region=minio,s3ForcePathStyle="true",s3Url=http://172.16.152.223:7480
```

![](https://gitee.com/animezjy/PicGo_img/raw/master/images/20210826232448.png)


## 测试名称空间备份

### 步骤

1. 创建一个新的命名空间，启动测试程序，这里以nginx为例
2. 通过标签选择器为对象创建一个备份
3. 模拟删除数据（删除整个namespace）
4. 检查数据真正删除
5. 恢复数据
6. 检查业务是否恢复正常



- 创建新资源

```
# 这里我们使用velero官方提供的样例
kubectl apply -f e xamples/nginx-app/base.yaml
# 查看资源状态
kubectl get deployment -n nginx-example


NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           4m43s
```

- 使用velero创建备份

```
$ velero backup create nginx-backup --selector app=nginx

I0824 11:56:36.418685 2891192 request.go:645] Throttling request took 1.16542532s, request: GET:https://172.16.152.223:6443/apis/coordination.k8s.io/v1beta1?timeout=32s
Backup request "nginx-backup" submitted successfully.
Run `velero backup describe nginx-backup` or `velero backup logs nginx-backup` for more details.
```

- 确认命名空间已经删除

```
[root@k8-ceph-1 velero]# kubectl get namespace nginx-example
Error from server (NotFound): namespaces "nginx-example" not found
```

- 恢复数据

```shell
velero restore create --from-backup nginx-backup
velero restore get
```



![](https://gitee.com/animezjy/PicGo_img/raw/master/images/20210826232557.png)


## 总结

本文简单介绍了kubernetes集群备份、恢复工具velero的使用方法，具体生产过程中的细节还需要具体把控，例如：对象存储的选择，备份数据的策略、持久化存储的数据备份...... 更多的功能可以查看velero官方手册进行查看