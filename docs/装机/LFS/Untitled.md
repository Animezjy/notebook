# **交叉编译临时工具**



> 使用`lfs`用户操作

## **M4**



```shell
tar -xf m4-1.4.19.tar.xz; cd m4-1.4.19

./configure --prefix=/usr   \
            --host=$LFS_TGT \
            --build=$(build-aux/config.guess)

make
make DESTDIR=$LFS install
```



## Ncurses



```shell
tar -xf ncurses-6.2.tar.gz; cd ncurses-6.2

# 确保优先使用gawk命令
sed -i s/mawk// configure
```

运行以下命令，在宿主系统构建`tic`程序：

```shell
mkdir build
pushd build
  ../configure
  make -C include
  make -C progs tic
popd
```

编译安装ncurses

```shell
# 准备编译
./configure --prefix=/usr                \
            --host=$LFS_TGT              \
            --build=$(./config.guess)    \
            --mandir=/usr/share/man      \
            --with-manpage-format=normal \
            --with-shared                \
            --without-debug              \
            --without-ada                \
            --without-normal             \
            --enable-widec
            
# 编译            
make

# 编译安装
make DESTDIR=$LFS TIC_PATH=$(pwd)/build/progs/tic install
echo "INPUT(-lncursesw)" > $LFS/usr/lib/libncurses.so
```



# Bash-5.1.8



安装bash

```shell
./configure --prefix=/usr                   \
            --build=$(support/config.guess) \
            --host=$LFS_TGT                 \
            --without-bash-malloc

make

make DESTDIR=$LFS install


# 为了方便使用sh命令
ln -sv bash $LFS/bin/sh

```



## Coreutils-8.32

Coreutils 软件包包含用于显示和设定系统基本属性的工具



```shell
tar -xf coreutils-8.32.tar.xz; cd coreutils-8.32
./configure --prefix=/usr                     \
            --host=$LFS_TGT                   \
            --build=$(build-aux/config.guess) \
            --enable-install-program=hostname \
            --enable-no-install-program=kill,uptime


make

make DESTDIR=$LFS install

```

将程序移动到它们最终安装时的正确位置

```shell
mv -v $LFS/usr/bin/chroot                                     $LFS/usr/sbin
mkdir -pv $LFS/usr/share/man/man8
mv -v $LFS/usr/share/man/man1/chroot.1                        $LFS/usr/share/man/man8/chroot.8
sed -i 's/"1"/"8"/'                                           $LFS/usr/share/man/man8/chroot.8
```



# Diffutils-3.8

Diffutils 软件包包含显示文件或目录之间差异的程序



```shell
tar -xf diffutils-3.8.tar.xz; cd diffutils-3.8
./configure --prefix=/usr --host=$LFS_TGT
make
make DESTDIR=$LFS install
```





# File-5.40

File 软件包包含用于确定给定文件类型的工具



> 宿主系统 **file** 命令的版本必须和正在构建的软件包相同，才能在构建过程中创建必要的签名数据文件。运行以下命令，为宿主系统构建它：

```shell
tar -xf file-5.40.tar.gz; cd  file-5.40

mkdir build
pushd build
  ../configure --disable-bzlib      \
               --disable-libseccomp \
               --disable-xzlib      \
               --disable-zlib
  make
popd
```

编译安装

```shell
# 准备编译
./configure --prefix=/usr --host=$LFS_TGT --build=$(./config.guess)

# 编译
make FILE_COMPILE=$(pwd)/build/src/file
# 安装
make DESTDIR=$LFS install
```



# Findutils-4.8.0

Findutils 软件包包含用于查找文件的程序。这些程序能够递归地搜索目录树，以及创建、维护和搜索文件数据库



```shell
tar -xf findutils-4.8.0.tar.xz; cd findutils-4.8.0
./configure --prefix=/usr   \
            --localstatedir=/var/lib/locate \
            --host=$LFS_TGT \
            --build=$(build-aux/config.guess)
            
make
make DESTDIR=$LFS install
```



# Gawk-5.1.0

Gawk 软件包包含操作文本文件的程序



```shell
tar -xf gawk-5.1.0.tar.xz; cd gawk-5.1.0
# 确保不要安装一些没必要的程序
sed -i 's/extras//' Makefile.in

./configure --prefix=/usr   \
            --host=$LFS_TGT \
            --build=$(./config.guess)
make
make DESTDIR=$LFS install
```



## **Grep-3.7**

Grep 软件包包含在文件内容中进行搜索的程序



```shell
tar -xf grep-3.7.tar.xz; cd grep-3.7
./configure --prefix=/usr   \
            --host=$LFS_TGT
make
make DESTDIR=$LFS install
```



## **Gzip-1.10**

Gzip 软件包包含压缩和解压缩文件的程序



```shell
tar -xf gzip-1.10.tar.xz cd gzip-1.10
./configure --prefix=/usr --host=$LFS_TGT
make
make DESTDIR=$LFS install
```



# Make-4.3

Make 软件包包含一个程序，用于控制从软件包源代码生成可执行文件和其他非源代码文件的过程。



```shell
tar -xf make-4.3.tar.gz cd make-4.3
./configure --prefix=/usr   \
            --without-guile \
            --host=$LFS_TGT \
            --build=$(build-aux/config.guess)
make
make DESTDIR=$LFS install
```



# Patch-2.7.6

Patch 软件包包含通过应用 “补丁” 文件，修改或创建文件的程序，补丁文件通常是 **diff** 程序创建的。



```shell
tar -xf patch-2.7.6.tar.xz; cd patch-2.7.6
./configure --prefix=/usr   \
            --host=$LFS_TGT \
            --build=$(build-aux/config.guess)
make
make DESTDIR=$LFS install
```



# Sed-4.8

Sed 软件包包含一个流编辑器。

```shell
tar -xf sed-4.8.tar.xz; cd sed-4.8
./configure --prefix=/usr   \
            --host=$LFS_TGT
make
make DESTDIR=$LFS install
```



# Tar-1.34

Tar 软件包提供创建 tar 归档文件，以及对归档文件进行其他操作的功能。Tar 可以对已经创建的归档文件进行提取文件，存储新文件，更新文件，或者列出文件等操作。



```shell
tar -xf tar-1.34.tar.xz; cd tar-1.34
./configure --prefix=/usr                     \
            --host=$LFS_TGT                   \
            --build=$(build-aux/config.guess)
make
make DESTDIR=$LFS install
```



# Xz-5.2.5

Xz 软件包包含文件压缩和解压缩工具，它能够处理 lzma 和新的 xz 压缩文件格式。使用 **xz** 压缩文本文件，可以得到比传统的 **gzip** 或 **bzip2** 更好的压缩比。



```shell
tar -xf xz-5.2.5.tar.xz; cd xz-5.2.5
./configure --prefix=/usr                     \
            --host=$LFS_TGT                   \
            --build=$(build-aux/config.guess) \
            --disable-static                  \
            --docdir=/usr/share/doc/xz-5.2.5
make
make DESTDIR=$LFS install
```



# Binutils-2.37 - 第二遍

Binutils 包含汇编器、链接器以及其他用于处理目标文件的工具。



```shell
../configure                   \
    --prefix=/usr              \
    --build=$(../config.guess) \
    --host=$LFS_TGT            \
    --disable-nls              \
    --enable-shared            \
    --disable-werror           \
    --enable-64-bit-bfd
make
make DESTDIR=$LFS install -j1
# 绕过导致 libctf.so 链接到宿主发行版 zlib 的问题：
install -vm755 libctf/.libs/libctf.so.0.0.0 $LFS/usr/lib
```





# GCC-11.2.0 - 第二遍



```shell
tar -xf ../mpfr-4.1.0.tar.xz
mv -v mpfr-4.1.0 mpfr
tar -xf ../gmp-6.2.1.tar.xz
mv -v gmp-6.2.1 gmp
tar -xf ../mpc-1.2.1.tar.gz
mv -v mpc-1.2.1 mpc
```

如果是在 x86_64 上构建，修改 64 位库文件的默认目录名为 `lib`：

```shell
case $(uname -m) in
  x86_64)
    sed -e '/m64=/s/lib64/lib/' -i.orig gcc/config/i386/t-linux64
  ;;
esac
```



```shell
mkdir -v build
cd       build

# 创建一个符号链接，以允许 libgcc 在构建时启用 POSIX 线程支持：
mkdir -pv $LFS_TGT/libgcc
ln -s ../../../libgcc/gthr-posix.h $LFS_TGT/libgcc/gthr-default.h
```

编译安装gcc

```shell
../configure                                       \
    --build=$(../config.guess)                     \
    --host=$LFS_TGT                                \
    --prefix=/usr                                  \
    CC_FOR_TARGET=$LFS_TGT-gcc                     \
    --with-build-sysroot=$LFS                      \
    --enable-initfini-array                        \
    --disable-nls                                  \
    --disable-multilib                             \
    --disable-decimal-float                        \
    --disable-libatomic                            \
    --disable-libgomp                              \
    --disable-libquadmath                          \
    --disable-libssp                               \
    --disable-libvtv                               \
    --disable-libstdcxx                            \
    --enable-languages=c,c++
make
make DESTDIR=$LFS install
```

最后，还需要创建一个符号链接。许多程序和脚本运行 **cc** 而不是 **gcc**，因为前者能够保证程序的通用性，使它可以在所有 UNIX 系统上使用，无论是否安装了 GNU C 编译器。运行 **cc** 可以将安装哪种 C 编译器的选择权留给系统管理员：

```shell
ln -sv gcc $LFS/usr/bin/cc
```

