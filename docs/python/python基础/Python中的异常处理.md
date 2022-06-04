## 什么是异常

程序运行中出现的一些问题，未能达到我们预期的效果

## 使用异常的作用

良好的异常处理会让程序更健壮

在C语言中是没有异常的概念的，调试程序要通过打断点、分析内存等方式。高级语言中支持异常相关操作，更方便了我们调试程序，分析业务

  

## python中的异常

python中的异常就是一个特殊的类， 该类可以被 `raise` 关键字触发。所有异常的基类是 `BaseException` 

  

### python内置异常

# python中的异常种类
BaseException   # 所有异常的基类
Execption	# 继承自BaseExecption 包含python内置的异常

TypeExecption # 类型异常
AttributeError # 属性异常
ValueError  # 值异常
NotImplementedError # 未实现异常（一般出现在抽象类时使用）
......

### 触发异常

在python中，通过 `raise` 关键字来抛出/触发一个异常

raise AttributeError("属性异常")

### 捕获异常

在python中，使用 `try ... except` 关键字来捕获异常

try:
    f = open("a.txt")   # 将可能发生的异常放在try语句中 
except FileNotFoundError:
    print("文件未找到")    # 一旦try中的语句出现我们捕获到的异常，该语句就会执行，可以在此处做业务处理

#  如果要一次性捕获多个异常，要使用元组的形式
try:
    f = open('a.txt')
except (FileNotFoundError, NameError):    # 重点记忆
    print("文件未找到")

使用捕获异常的方式，尽可能的让程序恢复到正常状态（一旦try中的语句必须正确执行，即无法恢复，就要在except中抛出异常，不能让其继续以错误的状态继续运行下去）

  

`try...except...else` 

try中包含将要发生异常的语句，如果未发生异常，执行else中的语句

`try...except...finally` 

无论是否发生异常，finally中的语句都会执行

一般用在回收资源的场景（例如、关闭文件句柄、关闭网络连接等）

---

注意：

-   在使用自定义异常时，要从 `Exception` 中继承，而不是从基类中
-   在捕获有派生关系的多个异常时，要注意异常的冒泡（及捕获的顺序）
-   平时在使用异常处理时，要**"从小到大",** （例如：except NameError, Exception）