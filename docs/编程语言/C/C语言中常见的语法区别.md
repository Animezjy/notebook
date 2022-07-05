## \#include "stdio.h" 和 \#include <stdio.h>的区别


\#include   "stdio.h"   
当要调用某个函数时   
先在用户自已编写的文件中查找，如果找不到再到库文件里去找， 
  
而#include   <stdio.h>　是直接到库文件里去找   
 
所以如果是调用自己写的函数的话就用#include   "stdio.h",这种形式   
而调用标准库函数的话就用#include   <stdio.h>这种形式，可以提高速度