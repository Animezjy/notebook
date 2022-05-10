---
tags: 学习/编程语言/C语言
---

在一个典型的架构中，分配给应用程序的内存分为4段：
* 堆：动态内存，内存空闲区，我们可以从堆获取我们想要的内存
* 栈：函数调用的所有信息和所有局部变量
* 静态区： 静态或全局变量
* 代码区： 需要执行的指令

> *栈*、*静态区*、*代码区* 这三个区域，程序在运行期间，它们的大小是不会增长的


程序执行的任何时候，都是从栈顶开始执行的，其他的函数会暂停。*先进后出*

操作系统会在编译时给栈空间分配一定的内存（具体分配多少取决于编译器和操作系统），但是实际的栈帧分配和局部变量的分配是在运行时，一旦栈增长超出了预留的内存，就会出现栈溢出现象，这会导致程序的崩溃。

### 堆的使用
在C语言中使用动态内存，需要了解4个函数

**malloc**
向堆内存中申请空间，返回一个指向这块内存起始地址的指针（void类型）。
```c
    void malloc(size_t size);
    // malloc接收一个正整数，指定了要申请的内存的大小（字节数）
    // malloc返回的是一个指向这块内存起始地址的void类型的指针
    void *p = malloc(10 * sizeof(int)) // 单元的数量* 每个单元的字节数
```

```c
#include <stdio.h>
#include <stdlib.h>
int main(void)
{
    int a; // 局部变量会分配在栈上
    int *p;
    p = (int*)malloc(sizeof(int))   // 这里注意malloc返回的指针类型是void，需要做一次类型转换
    *p = 10;
    printf("%d\n",*p);
    free(p);  // 释放内存
    return 0;
}
```

如果使用了malloc动态分配了一些内存，在不用的时候一定记得释放它，否则就会浪费内存（内存泄露)
使用malloc分配的内存，最终通过调用`free`进行释放。
malloc分配完内存之后并不会对其进行初始化。

**calloc**
向堆内存中申请空间，返回一个指向这块内存起始地址的指针（void类型）
```c
void *calloc(size_t num, size_t size);
// calloc接收两个参数，一个是特定类型的元素的数量，第二个参数是类型的大小。

int *p = (int*)calloc(3, sizeof(int));
```

calloc与malloc的异同点：
相同：
1. 都是向内存的堆区域中申请内存
2. 两个函数的返回值都是void类型的指针

不同：
1. malloc函数接收1个参数，calloc接收两个参数
2. malloc分配完内存之后并不会对其进行初始化，而calloc在分配完内存后会将其初始化为0


**realloc**
修改动态分配的内存块的大小

```c
void* realloc(void* ptr, size_t size);
// 第一个参数是指向已分配内存的起始地址的指针，第二个参数是新的内存块的大小
```


```c
#include <stdio.h>
#include <stdlib.h>
int main(void)
{
	int n;
	scanf("%d",&n);
	int* A = (int*)malloc(n*sizeof(int));
	for (int i = 0; i < n; i++)
	{
		A[i] = i + 1;
	}
	//free(A);
	int* B = (int*)realloc(A, 2 * n * sizeof(int));   
	printf("A的地址是%p,B的地址是%p\n",A,B);
	for (int i = 0; i < n; i++)
	{
		printf("%d",B[i]);
	}
	return 0;
}
```


### 内存泄露
内存泄露是不恰当的使用动态内存或者内存的堆区，在一段时间内持续增长。
栈上的内存时自动回收的，栈的大小是固定的