# **python基础**
## 1.1 **环境准备**
### 1.1.1 **安装python**
1. 官网下载python解释器
  进入[官网](https://www.python.org),进入下载页面，安装需要的版本

  ![image-20211230150033392](https://gitee.com/animezjy/PicGo_img/raw/master/images/202112301500503.png)

  

下载完毕后，根据提示一步一步安装即可

### 1.1.2 **编辑器的选择**
我这里大力推荐微软家的[Visual Studio Code](https://code.visualstudio.com/)，它可以跨平台，windows、mac、linux通用，重点是免费！！！如果要做项目的话，可以使用全家桶系列之一的Pycharm，以下是破解教程
- [Pycharm](tools/Pycharm)
## 1.2 **第一个python程序**
安装好编辑器后，新建一个文件`hello.py` 输入以下代码
```python
print("hello world!")
```
在终端运行命令:
```shell
$ ssadmin@Pegasus:~$ python3 hello.py 
hello world!
```
## 1.3 **数据类型**
Python中的数据类型包括
### **整数**
Python 可以处理任意大小的整数，当然包括负整数，在程序中的表示方法和数学上的写法一模一样，`1`，`10`等
Python 也支持二进制(0100)、八进制(0o100)、十六进制(0x10)的表示法
### **浮点数**
python中的浮点数就是小数，之所以称为浮点数，是因为按照科学记数法表示时，一个浮点数的小数点位置是可变的，浮点数除了数学写法（如111.2223）之外还支持科学计数法（如1.112223e2）
### **字符串**
字符串是以单引号或双引号括起来的文本，例如: `"你好"` `'你好'`，python中是不区分单双引号的
使用三引号`"""`可以定义多行文本
### **布尔值**
布尔型的值只有两个：`True` `False`
### **复数**
例如2+4j，和数学中的复数表示一直，只是字母不一样，很少会用到
## 1.5 **变量**

## 1.6 **条件判断**
## 1.7 **循环**
## **优秀的python教程**
- [廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1016959663602400)
- [python百天教程](https://github.com/jackfrued/Python-100-Days)
