## ceph对象存储的使用
### 什么是对象存储
百度百科定义如下:
> 对象存储，也叫做基于对象的存储，是用来描述解决和处理离散单元的方法的通用术语，这些离散单元被称作为对象。

和传统的存储相比，对象存储最大的不同有以下几点:
* 没有目录结构
* 需要特定的客户端软件/协议访问
* 对象存储中的文件不能直接打开/修改
应用场景: 适合存储更新/变动较少的文件
* 图片存储
* 文件存储
* 视频存储
* 软件安装包
* ......

### ceph的对象存储
> Ceph 对象存储使用 Ceph 对象网关守护进程（ radosgw ），它是个与 Ceph 存储集群交互的 FastCGI 模块。因为它提供了与 OpenStack Swift 和 Amazon S3 兼容的接口， RADOS 要有它自己的用户管理。 Ceph 对象网关可与 Ceph FS 客户端或 Ceph 块设备客户端共用一个存储集群。 S3 和 Swift 接口共用一个通用命名空间，所以你可以用一个接口写如数据、然后用另一个接口取出数据。

感兴趣想深入了解的可以查阅官方文档, 本文主要讲解如何简单使用
[官方地址](http://docs.ceph.org.cn/radosgw/)


### 安装
ceph对象存储的安装步骤很简单，按照官方文档操作即可
> 前提： 需要在本地有一个已经部署好的ceph集群, 具体部署步骤可以参考之前的文章

* 安装对象网关
在管理节点的工作目录下，运行以下命令

```
# --rgw 选项后面跟的是你的主机名
# eg: ceph-deploy install --rgw ceph-1
ceph-deploy install --rgw <gateway-node1> [<gateway-node2> ...]

```

* 新建网关实例
在对象网关节点上，运行以下命令，创建一个网关实例

```shell
ceph-deploy rgw create <gateway-node1>  # 此处的<gateway-node1> 为节点名称
```

安装成功后，可以访问节点的7480端口
```shell
curl http://172.16.111.11:7480 

# 返回结果如下
<?xml version="1.0" encoding="UTF-8"?><ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Owner><ID>anonymous</ID><DisplayName></DisplayName></Owner><Buckets></Buckets></ListAllMyBucketsResult>
```

到这里就安装成功了，如果你想修改访问的默认端口，或者想通过域名进行访问，请自行阅读官方文档进行配置

### 简单使用
Ceph 对象网关是一个构建在 `librados` 之上的对象存储接口，它为应用程序访问`Ceph 存储集群`提供了一个 `RESTful` 风格的网关 。 Ceph 对象存储支持 2 种接口：
* 兼容S3: 提供了对象存储接口，兼容 亚马逊S3 RESTful 接口的一个大子集。
* 兼容Swift: 提供了对象存储接口，兼容 Openstack Swift 接口的一个大子集。
本文主要介绍S3协议访问对象存储

ceph官方网站列出了兼容S3协议的一些API，地址如下:
[API地址](http://docs.ceph.org.cn/radosgw/s3/)
除了API访问，也可以使用亚马逊的`s3cmd`工具访问
>PS: 有关API的简单使用我会放到另一篇文章中

Centos7安装s3cmd:

```shell
yum -y install s3cmd
```

### s3cmd常用的命令

查看s3cmd帮助文档

```shell
s3cmd -h
```

列出桶中所有的对象

```shell
[ceph-deploy@ceph-1 ~]$ s3cmd la
                          DIR  s3://aavae/develop/

                          DIR  s3://abcd/develop/

                          DIR  s3://gbf//
2021-10-19 10:34            0  s3://gbf/develop
2021-10-19 10:34            0  s3://gbf/developfronted
2021-10-19 10:33            0  s3://gbf/fronted

                          DIR  s3://gouki//

                          DIR  s3://gran//

```





