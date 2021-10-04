## Ceph安装


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
    
