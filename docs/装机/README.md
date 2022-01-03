 # 系统安装及常用软件使用



* LFS系列
  * [LFS简介](装机/LFS/01-LFS简介)
  * [LFS分阶段构建](02-分阶段构建)









## 2.3.1. 第 1–4 章

这些章节是在宿主系统完成的。在重启后，注意下列事项：

- 在第 2.4 节之后，以 `root` 用户身份执行的步骤要求 LFS 环境变量已经*为 root 用户*设置好。

## 2.3.2. 第 5–6 章

- /mnt/lfs 分区需要重新挂载。
- 这两章的步骤*必须*由用户 `lfs` 完成。在完成这些步骤时，必须先执行 **su - lfs** 命令。否则，您可能会将软件包安装到宿主系统上，这可能导致宿主系统无法使用。
- [编译过程的一般说明](https://bf.mengyan1223.wang/lfs/zh_CN/11.0/partintro/generalinstructions.html)中的过程是关键的。如果在安装软件包时感觉不对劲，确认之前解压的源码包已经被删除，然后重新解压源码包的文件，重新执行该软件包对应章节的所有命令。

## 2.3.3. 第 7–10 章

- /mnt/lfs 分区需要重新挂载。
- 从 “改变所有权” 到 “进入 Chroot 环境” 的一些操作必须以 `root` 身份完成，且 LFS 环境变量必须为 `root` 用户设定。
- 在进入 chroot 环境时，LFS 环境变量必须为 `root` 设置好。之后就不需要 LFS 变量。
- 虚拟文件系统必须挂载好。在进入 chroot 环境之前，请切换到一个宿主系统的虚拟终端，以 `root` 身份执行[第 7.3.2 节 “挂载和填充 /dev”](https://bf.mengyan1223.wang/lfs/zh_CN/11.0/chapter07/kernfs.html#ch-tools-bindmount)和[第 7.3.3 节 “挂载虚拟内核文件系统”](https://bf.mengyan1223.wang/lfs/zh_CN/11.0/chapter07/kernfs.html#ch-tools-kernfsmount)中的命令。

- 上一页

  宿主系统需求

- 下一页

  创建新的分区





 ## Arch linux

 arch linux 是一款轻量、定制化高linux发行版，喜欢折腾的可以安装下玩玩，用作主力机还需谨慎

 * [官网](https://archlinux.org/)

### 安装及配置
arch linux相较于其他linux发行版来说，安装是比较麻烦的，这里推荐参考官方wiki或者以下这篇博客
* [Arch linux安装](https://www.viseator.com/2017/05/17/arch_install/)
