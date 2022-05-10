---
tags: 学习/运维技术/黑苹果
---

  

## 方法一

### 1. 下载完整镜像

在App Store中下载monterey的完整镜像，下载完成后，会在启动台看到 **安装 macOS Monterey**图标

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204271431396.png)


### 2.制作mac镜像

**创建一个临时磁盘**

```shell
hdiutil create -o /tmp/MacMonterey -size 12500m -volname MacMonterey -layout SPUD -fs HFS+
```

**将临磁盘挂载到/Volumes下**

```shell
hdiutil attach /tmp/MacMonterey.dmg -noverify -mountpoint /Volumes/MacMonterey
```
  

**使用MacOS Installer应用程序中的createinstallmedia程序，将安装程序文件复制到刚创建的磁盘映像中：**
```shell
sudo /Applications/Install\ macOS\ Monterey.app/Contents/Resources/createinstallmedia --volume /Volumes/MacMonterey --nointeraction
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204271432383.png)


**卸载磁盘**

```shell
hdiutil detach /Volumes/Shared\ Support/

hdiutil detach /Volumes/Install\ macOS\ Monterey/
```
**将 dmg 映像文件转换为 .cdr 映像文件，并保存到自己的桌面。**

```shell
hdiutil convert /tmp/MacMonterey.dmg -format UDTO -o ~/Desktop/MacMonterey.cdr
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204271433747.png)


**重命名镜像**

```shell
mv ~/Desktop/MacMonterey.cdr ~/Desktop/MacMonterey.iso
```
  

  

## 方法二

```shell
git clone https://github.com/kholia/OSX-KVM.git

cd OSX-KVM/scripts/monterey
make Monterey-full.dmg

```

>方法二只是将方法一的诸多步骤集成到了Makefile中，由于方法二依赖github上的项目，为了防止项目在将来的某天不可用，故将详细制作方法也同步列出