 # 系统安装及常用软件使用



* LFS系列
  * [LFS简介](装机/LFS/01-LFS简介)
  * [LFS分阶段构建](装机/LFS/02-准备宿主机系统)
  * [构建交叉工具链](装机/LFS/03-构建LFS交叉工具链和临时工具)





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
