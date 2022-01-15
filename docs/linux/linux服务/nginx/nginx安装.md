# **rsync命令使用**

rsync是linux系统下的数据镜像备份工具。使用快速增量备份工具Remote Sync可以远程同步，支持本地复制，或者与其他SSH、rsync主机同步。



## **rsync参数**

```shell
rsync参数：-avz
-a           #归档模式传输, 等于-tropgDl
-v           #详细模式输出, 打印速率, 文件数量等
-z           #传输时进行压缩以提高效率
-r           #递归传输目录及子目录，即目录下得所有目录都同样传输。
-t           #保持文件时间信息
-o           #保持文件属主信息
-p           #保持文件权限
-g           #保持文件属组信息
-l           #保留软连接
-P           #显示同步的过程及传输时的进度等信息
-D           #保持设备文件信息
-L           #保留软连接指向的目标文件
-e           #使用的信道协议,指定替代rsh的shell程序  ssh
--exclude=PATTERN   #指定排除不需要传输的文件模式
--exclude-from=file #文件名所在的目录文件
--bwlimit=100       #限速传输
--partial           #断点续传
--delete            #让目标目录和源目录数据保持一致
```



## **常用场景**



**本地传输文件到远程**

```shell
# 将本地的 /root下的所有文件（包含root目录），推送到172.16.153.149的tmp目录下面，使用的是root身份推送
$ rsync -avz /root    172.16.153.149:/tmp/

# 将本地的/root下的所有文件（不包含root目录），推送到172.16.153.149的tmp目录下，使用的root身份推送
$ rsync -avz /root/  172.16.153.149:/tmp/
```

!>  源目录后面加上`/`即表示传输目录下所有文件，而不包括目录本身



**使用后台进程方式传输**

环境：

* A主机（192.168.10.1）： 作为客户端
* B主机（192.168.10.2）：作为服务端



在B主机上安装rsync服务

```shell
$ yum -y install rsync
```

修改配置文件`/etc/rsyncd.conf`

```shell
uid  = root       # 运行进程的用户
gid  = root				# 运行进程的组

hosts allow = *		# 允许的主机
read only = no    # 是否只读
use chroot = no   # 是否限制工作目录
list = no        
  
max connections = 1000  # 最大连接数
timeout = 300           # 超时时间
reverse lookup = no		

[ace]      # 分组信息
path = /volume1/rc_storage/ace/   # 数据备份目录
ignore errors
incoming chmod = Du=rwx,Dog=rx,Fu=rw,Fgo=r
secrets file = /volume1/rc_storage/ace/.rsync/secrets/ace.rsyncd.secrets    # 密码文件  文件内容形如 ace:xxxxxx
auth users = ace   # 认证用户
```

添加密码文件`ace.rsyncd.secrets`

```shell
ace:abcdx23df@
```

!>  密码文件格式为   组信息:密码内容    密码文件的权限要设置为`600`



启动rsyncd服务

```shell
$ systemctl start rsyncd
```



客户端进行测试

```shell
$ rsync -avz /root  ace@192.168.10.2::ace/
$ rsync -avz /root/ ace@192.168.10.2::ace/

# 也可以使用指定密码文件的形式
$ rsync -avz /root ace@192.168.10.2::ace/ --password-file ace.secrets 
```

!> 客户端侧的密码文件中不需要写组信息  直接写入密码内容即可



**增量备份**

通过使用`--delete`参数实现

```shell
#推送方式实现无差异，以客户端为准，客户端有什么服务端就有什么
$ rsync -avz --delete /root ace@172.16.1.41::ace        

#拉取方式实现无差异，以服务端为准，服务端有什么客户端就有什么
$ rsync -avz --delete ace@192.168.10.2::ace /opt/
```

