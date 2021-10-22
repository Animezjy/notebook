## Ceph(octopus)安装

### 准备工作
* 修改hosts文件

```shell
192.168.23.31 ceph-1
192.168.23.32 ceph-2
192.168.23.33 ceph-3
```

* 安装ceph-deploy
```shell
cat >>/etc/yum.repos.d/ceph.repo<<EOF
[ceph-noarch]
name=Ceph noarch packages
baseurl=http://download.ceph.com/rpm-octopus/el7/noarch
enabled=1
gpgcheck=1
type=rpm-md
gpgkey=https://download.ceph.com/keys/release.asc
EOF
####################################################
yum -y install ceph-deploy
```

* 配置SSH免密
> 你的管理节点必须能够通过 SSH 无密码地访问各 Ceph 节点。如果 ceph-deploy 以某个普通用户登录，那么这个用户必须有无密码使用 sudo 的权限
    * 创建ceph-deploy用户，并为其赋予`sudo`权限
```shell
useradd ceph-deploy
passwd ceph-deploy
echo "ceph-deploy ALL = (root) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/ceph-deploy
sudo chmod 0440 /etc/sudoers.d/ceph-deploy
```
    * 把公钥拷贝到各 Ceph 节点
```shell
ssh-copy-id ceph
```

### 安装ceph集群(使用ceph-deploy)
* 创建临时目录
> 在管理节点上创建一个目录，用于保存 ceph-deploy 生成的配置文件和密钥对

```shell
mkdir my-cluster
cd my-cluster
```
> 如果想清除配置，重新安装ceph 可以运行以下的命令
```shell
ceph-deploy purgedata ceph-1 ceph-2 ceph-3
ceph-deploy forgetkeys
# 删除ceph安装包
ceph-deploy purge ceph-1 ceph-2 ceph-3
```
* 创建集群和监控节点
```shell
# ceph-deploy new {initial-monitor-node(s)}
ceph-deploy new ceph-1 ceph-2 ceph-3
```
* 修改配置文件
> 把 Ceph 配置文件里的默认副本数从 3 改成 2 ，这样只有两个 OSD 也可以达到 active + clean 状态。把 osd pool default size = 2 加入 [global] 段：

```shell
[global]
fsid = b7cc994b-5d3c-4a24-adb1-475f79877478
mon_initial_members = ceph-1, ceph-2, ceph-3
mon_host = 192.168.23.31,192.168.23.32,192.168.23.33
auth_cluster_required = cephx
auth_service_required = cephx
auth_client_required = cephx

osd pool default size = 2 # osd副本数
```
* 在所有节点上安装ceph
```shell
ceph-deploy install ceph-1 ceph-2 ceph-3
```
* 配置初始 monitor(s)、并收集所有密钥

```shell
ceph-deploy mon create-initial
完成上述操作后，当前目录里应该会出现这些密钥环：

{cluster-name}.client.admin.keyring
{cluster-name}.bootstrap-osd.keyring
{cluster-name}.bootstrap-mds.keyring
{cluster-name}.bootstrap-rgw.keyring

```
* 将配置文件同步到各个节点

ceph-deploy --overwrite-conf config push ceph-{1,2,3}


* 添加OSD
```shell
ceph-deploy osd create ceph-1 --data /dev/sdb
ceph-deploy osd create ceph-2 --data /dev/sdb
ceph-deploy osd create ceph-3 --data /dev/sdb
```
* 把配置文件和 admin 密钥拷贝到管理节点和 Ceph 节点
```shell
ceph-deploy admin ceph-1 ceph-2 ceph-3
```
* 创建管理后台mgr
```shell
ceph-deploy mgr create ceph-1 ceph-2 
```

* 创建文件系统
```shell
ceph-deploy mds create ceph-1 ceph-2 ceph-3
# 创建存储池，存储元数据和数据
ceph osd pool create cephfs_data 128
ceph osd pool create cephfs_metadata 16
# 创建文件系统
ceph fs new cephfs cephfs_metadata cephfs_data
# 设置主mds最大数量为1
ceph fs set cephfs max_mds 1
```









### 安装过程中出现的错误及解决办法
* python版本不兼容
![20211004205556](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211004205556.png)
解决办法：
```shell
yum -y install python2-pip.noarch
```