---
tags: 学习/编程语言/C语言
---

## 目录
* 一、基本类型
    * 整型
        * short短整型
        * int整型
        * long长整型
    * 浮点型
        * float单精度浮点型
        * double双精度浮点型
    * char字符类型
* 二、派生类型
    * 数组
    * struct结构体
    * union共用体
    * enum枚举类型
    * 指针类型
    * void空类型


## 基本类型

### 整型

|类型|存储大小|值范围|
|:---:|:---:|:---:|
|char|1字节|-128-127或0-255|
|unsigned char|1字节|0-255|
|short|2字节|-32768-32767|
|unsigned short|2字节|0-65535|
|int|2或4字节|-32768-32767或-2,147,483,648-2,147,483,647|
|unsigned int|2或4字节|0-65535或0-4,294,967,295|


```c
char a = 'A';
short b = 11;
int c = 33333;
```

在C语言中，`char`关键字用来声明字符变量，计算机在存储时还是以整数形式存储

### 浮点型

|类型|存储大小|值范围|
|:---:|:---:|:---:|
|float|4字节|1.2E-38 到 3.4E+38|
|double|8字节|2.3E-308 到 1.7E+308|

浮点型对应的就是生活中的小数
```c
float price = 3.12;
double d = 3.66654;
```

## 派生类型

### 数组类型
数组类型中存储了一个固定大小的相同元素的集合。
例如班级共有50个学生，可以声明一个数组来存储所有学生的年龄

#### 数组的使用

**声明一个数组**
```c
//类型 变量名 [ 数据大小 ] 

int age[50];
char name[100];
float price[10];
```

**数组初始化**
可以使用初始化语句对数组进行初始化
```c
int num[5] = {1, 2, 3, 4, 5};

int balance[] = {1.0, 2.0, 3.0}; //如果省略数组大小，那么数组大小就位初始化时声明的元素的个数

num[3] = 10; //为数组中某个元素赋值
```

**数组的访问**
可以通过下标的形式访问数组中的元素
```c
int num[5] = {1, 2, 3, 4, 5};
printf("%d", num[4]);
>>> 5
```

输出数组中的每个元素
```c
#include <stdio.h>
int main(void)
{
        int num[5] = {1, 2, 3, 4, 5};
        for(int i=0;i<5;i++){
                printf("%d\n", i);
}
        return 0;

}

0
1
2
3
4

```


### struct 结构体
C语言提供了一种可供用户自定义的数据类型:`struct`
我们可以使用结构体存储一组不同数据类型的数据

```c
struct Book{
    char title[20];
    char author[10];
    char content[100];
    int book_id;
}
```


### union共用体
共用体是一种特殊的数据类型，允许在相同的内存位置存储不同的数据类型，但是任何时候只能有一个成员带有值。

共同体的声明
```c
union data{
    int n;
    char ch;
    double f;  
};
```

> 结构体和共用体的区别在于：结构体的各个成员会占用不同的内存，互相之间没有影响；而共用体的所有成员占用同一段内存，修改一个成员会影响其余所有成员。


### enum枚举类型
C语言提供了一种**枚举（Enum）类型**，能够列出一个变量所有可能的取值，并给它们取一个名字。

声明一个枚举类型
```c
enum week{ Mon, Tues, Wed, Thurs, Fri, Sat, Sun};
```
枚举值默认从0开始，依次递增

### 指针类型
C语言中的指针类型是十分复杂的，这里只做简单的介绍，后边详细总结

**指针是程序数据在内存中的地址，而指针变量是用来保存这些地址的变量**
> 指针的值实质是内存单元（即字节）的编号

定义指针变量
```c
int a //int类型变量
int* p_int; //指向int类型变量的指针
......
```
### void类型
void类型比较特殊，它表示没有可用的值。不能把它和0画等号
