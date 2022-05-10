---
tags: 学习/运维技术/Linux大杂烩
---
  

拓扑 

![](https://cdn.nlark.com/yuque/0/2022/png/22349687/1650526858827-16fc5093-a5d2-42c7-8646-31b14f90e20a.png)

## 1.搭建配置 (韩国服务器配置)

（参考：[https://iyideng.vip/black-technology/cgfw/trojan-server-building-and-using-tutorial.html#5%E3%80%81Trojan%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE](https://iyideng.vip/black-technology/cgfw/trojan-server-building-and-using-tutorial.html#5%E3%80%81Trojan%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE)）

#### **Trojan多用户一键搭建脚本（推荐）**

在这里，我推荐您使用 Debian 9/11 或 CentOS 7 系统搭建环境（推荐使用 Debian 11 系统），如果您使用其他系统环境搭建可能会遇到莫名其妙的问题，浪费时间和精力。经测试，使用部分主机商的 Debian 10 服务器系统搭建，curl组件可能无法正常使用，导致一键脚本安装命令执行不成功，请认真斟酌！！！

**安装 Curl 依赖包**

yum update -y && yum install curl -y #CentOS/Fedora apt-get update -y && apt-get install curl -y #Debian/Ubuntu

**执行一键脚本安装命令**

```shell
source <(curl -sL https://git.io/trojan-install)
```

当以上命令执行完毕会安装Trojan管理程序，然后选择安装SSL证书的方式并绑定域名，我们选择“1.Let’s Encrypt 证书”，然后输入域名，如“gfw.mydomain.tk”。如下图所示：

![](https://cdn.nlark.com/yuque/0/2022/png/22349687/1650525482357-3b1f1cf1-76b8-4a51-a127-83a226575f95.png)

请确认域名输入准确无误，然后回车，进入SSL证书安装过程。稍等片刻安装完成，系统进入选择安装mysql方式的选项，我们选择“1.安装docker版mysql(mariadb)”。如下图所示：

![](https://cdn.nlark.com/yuque/0/2022/png/22349687/1650525482525-13441053-0edd-400f-8d31-6d0d1e26ebb3.png)

你只需在键盘按数字“1”，然后直接进入”安装docker版mysql(mariadb)”的过程。安装完成后，一键安装脚本提示设置连接Trojan服务器的用户名和密码。如下图所示：

![](https://cdn.nlark.com/yuque/0/2022/png/22349687/1650525482331-88d8cdb6-8727-4995-ba53-25d640b9ff0d.png)

一般情况下，我们使用随机用户名和密码，直接回车即可。如果你对默认的用户名和密码不满意，还可以自己设置，或安装完成后到Web面板里修改；如果你忘记了登录密码，也可以在“web管理”重置web管理员密码。

至此，Trojan多用户一键搭建脚本安装完毕。现在你可以输入’trojan’可进入管理程序，在出现的管理程序菜单，直接在键盘按“数字键”直接进入相关菜单或执行命令，直接按“回车键”返回上级菜单。比如，你直接按数字键“5”，可查看用户配置的用户名、密码和Trojan分享链接，以及单用户的上传、下载流量和流量限额。如下图所示：

![](https://cdn.nlark.com/yuque/0/2022/png/22349687/1650525482485-10a30fb4-509a-468b-a086-6ea497d9ebb2.png)

你也可以在浏览器访问“https://域名”，比如 https://gfw.mydomain.tk，登录web面板管理trojan用户。如下图所示：

![](https://cdn.nlark.com/yuque/0/2022/png/22349687/1650525482450-5e1bcbe8-b0a2-426b-a08c-f8b228290c57.png)

**卸载命令**

```shell
source <(curl -sL https://git.io/trojan-install) –remove
```
  

  

**国内服务器配置端口转发**

```shell
iptables  -t  nat  -A PREROUTING -p tcp -m tcp --dport 8443 -j DNAT --to-destination 8.213.130.144:443
iptables  -t  nat  -A POSTROUTING -s  0.0.0.0/0 -p tcp --dport 443 -j MASQUERADE
```

> 只允许国内的机器访问国外，最大程度上保证安全

## 客户端：

（参考链接：[https://iyideng.vip/black-technology/cgfw/trojan-client-download-and-installation-tutorial.html#1%E3%80%81Trojan%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%B8%8B%E8%BD%BD](https://iyideng.vip/black-technology/cgfw/trojan-client-download-and-installation-tutorial.html#1%E3%80%81Trojan%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%B8%8B%E8%BD%BD)）