



## 一、snmp exporter安装

下载snmp_exporter
```shell
wget https://github.com/prometheus/snmp_exporter/releases/download/v0.19.0/snmp_exporter-0.19.0.linux-amd64.tar.gz
```
snmp exporter是一个二进制文件，解压后可以直接使用



## 二、snmp exporter 配置
术语解释

**OID（Object Identifier）**：对象标识符，是与对象相关联的用来无歧义地标识对象的**全局唯一**的值，通俗理解为网络通信中对象的身份证
**MIB（Management Information Base）**：管理信息库，是TCP/IP网络管理协议标准框架的内容之一，MIB定义了受管设备必须保存的数据项，管理系统可访问的受管设备的控制和状态信息等数据变量保存在MIB中
**generator**：是snmp_exporter官方提供的一个自动生成

> 以上名词的具体说明可以自行参考官方解释

官方默认提供了一个`snmp.yml`的模板，里面包含了大部分的配置信息，但是有些设备在这里并没有支持，因此需要手动生成一下

>*注意*: snmp.yml文件不要手动修改，需要通过特定的方式生成


**配置go环境**
```shell
wget https://golang.google.cn/dl/go1.18.linux-amd64.tar.gz
tar -xf go1.18.linux-amd64.tar.gz -C /opt
# 在/etc/profile中追加go相关配置
export GOROOT=/opt/go
export PATH=$PATH:$GOROOT/bin

go versioin
```


**编译安装generator**
```shell
yum install gcc gcc-g++ make net-snmp net-snmp-utils net-snmp-libs net-snmp-devel -y
# 进入generator目录，编译
cd /root/snmp_exporter/generator; go build .
```


## 手动生成`snmp.yml`文件

通过厂商提供的MIB文件，可以查询出设备对应的OID，这里推荐使用*MIB Browser*软件
[Network Management / Network Monitoring / SNMP Monitoring / MIB Browser](https://ireasoning.com/download.shtml)

下面这个网站提供了OID与监控指标的映射，通过搜索OID，可以查看此OID对应的监控指标
[OID 1.3.6.1.2.1.31.1.1.1 ifXEntry reference info](https://oidref.com/1.3.6.1.2.1.31.1.1.1)


修改generator.yaml配置
```yaml
modules:
  # Default IF-MIB interfaces table with ifIndex.
  if_mib:
    auth:
      community: public12   # snmp配置的团体名
    walk:
      - sysUpTime
      - interfaces
      - ifTable
      - 1.3.6.1.2.1.31.1.1.1.10
      - 1.3.6.1.2.1.31.1.1.1.6
    lookups:
      - source_indexes: [ifIndex]
        lookup: ifAlias
      - source_indexes: [ifIndex]
        lookup: ifDescr
      - source_indexes: [ifIndex]
        lookup: ifName
    overrides:
      ifAlias:
        ignore: true
      ifDescr:
        ignore: true
      ifName:
        ignore: true
      ifType:
        type: EnumAsInfo
```
将MIB文件移动到snmp_exporter默认的mibs目录下
```shell
# 我们直接使用配置文件中的if_mib模块，直接使用厂商的MIB替换默认的MIB即可
mv MIB.mib /usr/share/snmp/mibs/IF-MIB.txt
```
使用`generator`工具生成`snmp.yml`文件

```shell
cd /root/snmp_exporter/generator 
./generator generator.yml

......
ts=2022-04-08T10:13:43.697Z caller=main.go:52 level=info msg="Generating config for module" module=nec_ix
ts=2022-04-08T10:13:43.719Z caller=main.go:67 level=info msg="Generated 
ts=2022-04-08T10:13:43.841Z caller=main.go:67 level=info msg="Generated metrics" module=paloalto_fw metrics=228
ts=2022-04-08T10:13:44.304Z caller=main.go:92 level=info msg="Config written" file=/root/snmp_exporter/generator/snmp.yml

```
## 启动snmp_exporter
```
nohup /opt/snmp_exporter/snmp_exporter --config.file=/etc/default/snmp.yml &
```