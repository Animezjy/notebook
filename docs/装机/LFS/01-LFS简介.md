# ***Linux From Scratch***

LFS（*Linux From Scratch*）,从头构建一个操作系统，通过学习这个过程，全面了解操作系统底层调用原理





## **准备基础环境**

教程手册上提供了宿主机需要的软件列表，这里粘贴出来，作为参考

```txt
Coreutils-6.9

Diffutils-2.8.1

Findutils-4.2.31

Gawk-4.0.1 (/usr/bin/awk 必须是到 gawk 的链接)

GCC-6.2 包括 C++ 编译器, g++ (比 11.2.0 更新的版本未经测试，不推荐使用)

Glibc-2.11 (比 2.34 更新的版本未经测试，不推荐使用)

Grep-2.5.1a

Gzip-1.3.12

Linux Kernel-3.2

内核版本的要求是为了符合第 5 章和第 8 章中编译 glibc 时开发者推荐的配置选项。udev 也要求一定的内核版本。

如果宿主内核比 3.2 更早，您需要将内核升级到较新的版本。升级内核有两种方法，如果您的发行版供应商提供了 3.2 或更新的内核软件包，您可以直接安装它。如果供应商没有提供一个足够新的内核包，或者您不想安装它，您可以自己编译内核。编译内核和配置启动引导器 (假设宿主使用 GRUB) 的步骤在第 10 章中。

M4-1.4.10

Make-4.0

Patch-2.5.4

Perl-5.8.8

Python-3.4

Sed-4.1.5

Tar-1.22

Texinfo-4.7

Xz-5.0.0
```

教程还提供了一个检测宿主机环境的脚本

```shell
cat > version-check.sh << "EOF"
#!/bin/bash
# Simple script to list version numbers of critical development tools
export LC_ALL=C
bash --version | head -n1 | cut -d" " -f2-4
MYSH=$(readlink -f /bin/sh)
echo "/bin/sh -> $MYSH"
echo $MYSH | grep -q bash || echo "ERROR: /bin/sh does not point to bash"
unset MYSH

echo -n "Binutils: "; ld --version | head -n1 | cut -d" " -f3-
bison --version | head -n1

if [ -h /usr/bin/yacc ]; then
  echo "/usr/bin/yacc -> `readlink -f /usr/bin/yacc`";
elif [ -x /usr/bin/yacc ]; then
  echo yacc is `/usr/bin/yacc --version | head -n1`
else
  echo "yacc not found" 
fi

bzip2 --version 2>&1 < /dev/null | head -n1 | cut -d" " -f1,6-
echo -n "Coreutils: "; chown --version | head -n1 | cut -d")" -f2
diff --version | head -n1
find --version | head -n1
gawk --version | head -n1

if [ -h /usr/bin/awk ]; then
  echo "/usr/bin/awk -> `readlink -f /usr/bin/awk`";
elif [ -x /usr/bin/awk ]; then
  echo awk is `/usr/bin/awk --version | head -n1`
else 
  echo "awk not found" 
fi

gcc --version | head -n1
g++ --version | head -n1
ldd --version | head -n1 | cut -d" " -f2-  # glibc version
grep --version | head -n1
gzip --version | head -n1
cat /proc/version
m4 --version | head -n1
make --version | head -n1
patch --version | head -n1
echo Perl `perl -V:version`
python3 --version
sed --version | head -n1
tar --version | head -n1
makeinfo --version | head -n1  # texinfo version
xz --version | head -n1

echo 'int main(){}' > dummy.c && g++ -o dummy dummy.c
if [ -x dummy ]
  then echo "g++ compilation OK";
  else echo "g++ compilation failed"; fi
rm -f dummy.c dummy
EOF
```

> 经过我的测试，新安装的Centos7(2009版本)除了gcc g++ make之外，其他软件均使用yum直接安装即可

gcc升级至7.3

```shell
yum -y install centos-release-scl 
yum -y install devtoolset-7-gcc devtoolset-7-gcc-c++ devtoolset-7-binutils 
scl enable devtoolset-7 bash
echo "source /opt/rh/devtoolset-7/enable" >>/etc/profile
```

![image-20220102125548744](https://gitee.com/animezjy/PicGo_img/raw/master/images/202201021255183.png)



make 升级至4.0



```shell
cd /tmp
wget http://mirrors.ustc.edu.cn/gnu/make/make-4.0.tar.gz
tar xf make-4.0.tar.gz 
cd make-4.0/
./configure 
make
make install
make -v
# 此时的 make 还是3.82 与环境变量有关系
/usr/local/bin/make -v
# 这是我们刚安装的 make 它的版本是4.0
whereis make
# 找一下都有哪些 make
cd /usr/bin/
mv make make.bak
# 把默认的 make 改名 
ln -sv /usr/local/bin/make /usr/bin/make
# 建立一个软连接
make -v
# 查看一下大功告成
```

