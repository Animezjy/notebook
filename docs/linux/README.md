# **Linux常见问题排查**



## **Python占用CPU资源过大**

公司线上部署的jumpserver服务占用CPU资源过大，通过观察系统层面资源消耗来定位问题



### **使用top命令查看负载情况**



![image-20220104161000547](https://gitee.com/animezjy/PicGo_img/raw/master/images/202201041610856.png)

通过观察发现，`koko`进程占用了大量的CPU资源。`koko`是jumpserver（开源堡垒机）中的一个组件



