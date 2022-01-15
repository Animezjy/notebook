# **构建 LFS 交叉工具链和临时工具**



## **交叉编译**



一句话概括：交叉编译就是在一个平台上编写和编译代码，能够在另一个平台上运行

为什么要有交叉编译：一般来说，交叉编译的使用场景都是在性能好的机器上将代码编译好，然后放到另一个架构的平台上面运行。这样提高了编译速度，提升效率



## **安装交叉工具链**



!> 本节操作均使用`lfs`用户执行



手册中的重要提示

> 再次强调构建过程：
>
> 1. 把所有的源码包和补丁放在一个能够从 chroot 环境访问的目录，例如 `/mnt/lfs/sources/`。
> 2. 切换到放着源码包的目录。
> 3. 对于每个软件包：
>    1. 使用 **tar** 程序，解压需要构建的软件包。
>    2. 切换到解压源码包时产生的目录。
>    3. 根据书中的指示构建软件包。
>    4. 切换回包含所有源码包的目录。
>    5. 除非另有说明，删除解压出来的目录。

### **安装Binutils**



```shell
cd /mnt/lfs/sources;


tar -xf binutils-2.37.tar.xz ; cd binutils-2.37

mkdir build; cd build

../configure --prefix=$LFS/tools \
             --with-sysroot=$LFS \
             --target=$LFS_TGT   \
             --disable-nls       \
             --disable-werror
             
make

make install -j1  # 如果 MAKEFLAGS 中包含了 -j N，构建系统中的一个问题可能导致安装过程失败。该选项覆盖其设置，以绕过这个问题。
```



### **安装交叉工具链中的GCC**



GCC 依赖于 GMP、MPFR 和 MPC 这三个包。由于宿主发行版未必包含它们，我们将它们和 GCC 一同构建。将它们都解压到 GCC 源码目录中，并重命名解压出的目录，这样 GCC 构建过程就能自动使用它们

```shell
cd /mnt/lfs/sources
tar -xf gcc-11.2.0.tar.xz; cd gcc-11.2.0

tar -xf ../mpfr-4.1.0.tar.xz
mv -v mpfr-4.1.0 mpfr
tar -xf ../gmp-6.2.1.tar.xz
mv -v gmp-6.2.1 gmp
tar -xf ../mpc-1.2.1.tar.gz
mv -v mpc-1.2.1 mpc

```

对于 x86_64 平台，还要设置存放 64 位库的默认目录为 `lib`

```shell
case $(uname -m) in
  x86_64)
    sed -e '/m64=/s/lib64/lib/' \
        -i.orig gcc/config/i386/t-linux64
 ;;
esac
```

编译GCC

```shell
mkdir build; cd build

../configure                                       \
    --target=$LFS_TGT                              \
    --prefix=$LFS/tools                            \
    --with-glibc-version=2.11                      \
    --with-sysroot=$LFS                            \
    --with-newlib                                  \
    --without-headers                              \
    --enable-initfini-array                        \
    --disable-nls                                  \
    --disable-shared                               \
    --disable-multilib                             \
    --disable-decimal-float                        \
    --disable-threads                              \
    --disable-libatomic                            \
    --disable-libgomp                              \
    --disable-libquadmath                          \
    --disable-libssp                               \
    --disable-libvtv                               \
    --disable-libstdcxx                            \
    --enable-languages=c,c++


make 
make install
```



### **安装linux内核 API 头文件**



Linux API 头文件 (在 linux-5.13.12.tar.xz 中) 导出内核 API 供 Glibc 使用

```shell
tar -xf linux-5.13.12.tar.xz
cd linux-5.13.12


make mrproper # 确保软件包中没有遗留陈旧的文件

make headers
find usr/include -name '.*' -delete
rm usr/include/Makefile
cp -rv usr/include $LFS/usr
```



### **Glibc-2.34**

Glibc 软件包包含主要的 C 语言库。它提供用于分配内存、检索目录、打开和关闭文件、读写文件、字符串处理、模式匹配、算术等用途的基本子程序.



```shell
tar -xf glibc-2.34.tar.xz; cd glibc-2.34

# 首先，创建一个 LSB 兼容性符号链接。另外，对于 x86_64，创建一个动态链接器正常工作所必须的符号链接
case $(uname -m) in
    i?86)   ln -sfv ld-linux.so.2 $LFS/lib/ld-lsb.so.3
    ;;
    x86_64) ln -sfv ../lib/ld-linux-x86-64.so.2 $LFS/lib64
            ln -sfv ../lib/ld-linux-x86-64.so.2 $LFS/lib64/ld-lsb-x86-64.so.3
    ;;
esac
```

一些 Glibc 程序使用与 FHS 不兼容的 `/var/db` 目录存放它们的运行时数据。下面应用一个补丁，使得这些程序在 FHS 兼容的位置存放运行时数据：



```shell
patch -Np1 -i ../glibc-2.34-fhs-1.patch
```

![image-20220103110200276](https://gitee.com/animezjy/PicGo_img/raw/master/images/202201031102393.png)



编译glibc



```shell
echo "rootsbindir=/usr/sbin" > configparms
../configure                             \
      --prefix=/usr                      \
      --host=$LFS_TGT                    \
      --build=$(../scripts/config.guess) \
      --enable-kernel=3.2                \
      --with-headers=$LFS/usr/include    \
      libc_cv_slibdir=/usr/lib

make
make DESTDIR=$LFS install
```

改正 **ldd** 脚本中硬编码的可执行文件加载器路径：

```shell
sed '/RTLDLIST=/s@/usr@@g' -i $LFS/usr/bin/ldd
```

现在我们的交叉工具链已经构建完成，可以完成 limits.h 头文件的安装。为此，运行 GCC 开发者提供的一个工具：

```shell
$LFS/tools/libexec/gcc/$LFS_TGT/11.2.0/install-tools/mkheaders
```



### **GCC-11.2.0 中的 Libstdc++**



> Libstdc++ 是 GCC 源代码的一部分。应该先解压 GCC 源码包并切换到解压出来的 `gcc-11.2.0` 目录。



```shell
cd /mnt/lfs/sources/gcc-11.2.0

mkdir build ; cd build

../libstdc++-v3/configure           \
    --host=$LFS_TGT                 \
    --build=$(../config.guess)      \
    --prefix=/usr                   \
    --disable-multilib              \
    --disable-nls                   \
    --disable-libstdcxx-pch         \
    --with-gxx-include-dir=/tools/$LFS_TGT/include/c++/11.2.0

make
make DESTDIR=$LFS install

```



## **交叉编译临时工具**

* M4
* 