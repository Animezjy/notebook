#学习/运维技术/黑苹果
  
## 一、准备

-   一台Mac机器
-   Proxmox 7

## 二、步骤

### 1、创建安装镜像

在mac机器上执行

git clone https://github.com/kholia/OSX-KVM.git

cd OSX-KVM/scripts/monterey
make Monterey-full.dmg

mv Monterey-full.img

### 2、获取OpenCore镜像

  

在[Releases · thenickdude/KVM-Opencore · GitHub](https://github.com/thenickdude/KVM-Opencore/releases)下载OpenCore的`.iso.tar.gz` 文件，注意下载V15以上的版本，解压后得到`.iso`的文件

  

### 3、上传镜像

  

将构建好的镜像上传至Proxmox服务器的存放iso的目录下

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291546717.png)


### 4、获取OSK

  

在macOS下创建一个`smc_read.c`的文件

  
```c
#include <stdio.h>
#include <IOKit/IOKitLib.h>

typedef struct {
    uint32_t key;
    uint8_t  __d0[22];
    uint32_t datasize;
    uint8_t  __d1[10];
    uint8_t  cmd;
    uint32_t __d2;
    uint8_t  data[32];
} AppleSMCBuffer_t;

int
main(void)
{
    io_service_t service = IOServiceGetMatchingService(kIOMasterPortDefault,
                               IOServiceMatching("AppleSMC"));
    if (!service)
        return -1;

    io_connect_t port = (io_connect_t)0;
    kern_return_t kr = IOServiceOpen(service, mach_task_self(), 0, &port);
    IOObjectRelease(service);
    if (kr != kIOReturnSuccess)
        return kr;

    AppleSMCBuffer_t inputStruct = { 'OSK0', {0}, 32, {0}, 5, }, outputStruct;
    size_t outputStructCnt = sizeof(outputStruct);

    kr = IOConnectCallStructMethod((mach_port_t)port, (uint32_t)2,
             (const void*)&inputStruct, sizeof(inputStruct),
             (void*)&outputStruct, &outputStructCnt);
    if (kr != kIOReturnSuccess)
        return kr;

    int i = 0;
    for (i = 0; i < 32; i++)
        printf("%c", outputStruct.data[i]);

    inputStruct.key = 'OSK1';
    kr = IOConnectCallStructMethod((mach_port_t)port, (uint32_t)2,
             (const void*)&inputStruct, sizeof(inputStruct),
             (void*)&outputStruct, &outputStructCnt);
    if (kr == kIOReturnSuccess)
        for (i = 0; i < 32; i++)
            printf("%c", outputStruct.data[i]);

    printf("\n");

    return IOServiceClose(port);
}
```
  

编译

  
```shell
gcc -o smc_read smc_read.c -framework IOKit
```
  

执行命令获取OSK

  
```shell
./smc_read
```
  

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204271459548.png)

  

## 三、新建虚拟机

### 1、操作系统设置

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291545116.png)


镜像选择Opencore.iso

  

### 2、系统设置

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291545279.png)


### 3、磁盘设置

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291544606.png)


  

  

  

### 4、cpu设置

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291544475.png)


选择host类型的CPU

### 5、内存设置

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291544381.png)


  

### 6、网络设置

  

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291544888.png)


  

完成新建虚拟机之后先不要运行

  

### 7、虚拟机设置

#### 1、使用平板指针(Use tablet for pointer)

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291544709.png)


#### 2、挂载安装镜像

在硬件设置中添加CD/DVD设备，总线 选择IDE，ID设置为0

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291543386.png)


  

#### 3、修改启动顺序

将OpenCore设置为首选项

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291543779.png)


![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291543864.png)


  

#### 4、编辑虚拟机配置文件

登录proxmox机器，修改虚拟机配置文件
```shell
args: -device isa-applesmc,osk=ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc -smbios type=2 -device usb-kbd,bus=ehci.0,port=2 -global nec-usb-xhci.msi=off -global ICH9-LPC.acpi-pci-hotplug-with-bridge-support=off
```

注意：在文件的首行添加

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291542586.png)


找到挂在和安装镜像的那一行，将`media=cdrom`修改为`cache=unsafe`

最终的配置文件类似下面列出这样

```conf
args: -device isa-applesmc,osk=ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc -smbios type=2 -device usb-kbd,bus=ehci.0,port=2 -global nec-usb-xhci.msi=off -global ICH9-LPC.acpi-pci-hotplug-with-bridge-support=off
agent: 1
balloon: 0
bios: ovmf
boot: order=ide2;virtio0;net0;ide0
cores: 8
cpu: host
efidisk0: sdb:106/vm-106-disk-1.raw,efitype=4m,size=528K
ide0: sdb:iso/Monterey-full.img,cache=unsafe,size=14G
ide2: sdb:iso/OpenCore-v16.iso,cache=unsafe
machine: q35
memory: 8192
meta: creation-qemu=6.1.1,ctime=1651197134
name: Mac-Monterey-2
net0: virtio=52:78:0B:E1:08:2D,bridge=vmbr0,firewall=1,tag=220
numa: 0
ostype: other
scsihw: virtio-scsi-pci
smbios1: uuid=1371f31c-bb74-4982-8496-7d0246c2eceb
sockets: 1
vga: vmware
virtio0: sdb:106/vm-106-disk-0.raw,cache=unsafe,discard=on,size=300G
vmgenid: 9161ebdd-5a8e-4918-b0a0-766c6f77d9b1

```

  

## 四、设置Proxmox

  
执行如下命令，更新内核，防止 macOS 虚拟机无限重启

```shell
echo "options kvm ignore_msrs=Y" >> /etc/modprobe.d/kvm.conf && update-initramfs -k all -u
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291541842.png)



## 五、安装Monterey

开启虚拟机，选择 Install macOS Monterey

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291541500.png)


### 1、格式化磁盘

将创建的磁盘格式化为APFS格式

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291541313.png)


  

### 2、开始安装

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291541094.png)


安装过程中会出现几次重启，重启后选择mac install选项继续安装

  

安装完成后，选择已经装好系统的磁盘，进入虚拟机

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291540112.png)


  

## 六、配置开机自动进入系统

  

### 1、将EFI写入磁盘

进入虚拟机后，在终端执行

```shell
diskutil list
```

找到Opencore.iso中EFI分区的ID和macOS磁盘的EFI分区的ID，使用dd命令写入EFI

```shell
sudo dd if=/dev/disk2s1 of=/dev/disk0s1
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291540995.png)


关闭系统，在硬件设置中删除Opencore和Monterey安装镜像

### 2、设置开机自动启动

上述操作完成后，每次打开虚拟机，都会停留在这个界面，需要手动点击进入系统，下面来设置开机自动启动

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291539331.png)


打开macOS终端，挂载磁盘的EFI分区

```shell
sudo mkdir /Volumes/EFI
sudo mount -t msdos /dev/disk0s1 /Volumes/EFI
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291539311.png)


修改EFI分区下的`config.plist`文件，找到Timeout的选项，将里面的值设置成任意非零数字

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204291539565.png)


## 七、参考链接


[Install macOS12 Monterry on Proxmox 7](https://www.nicksherlock.com/2021/10/installing-macos-12-monterey-on-proxmox-7/#more-1167)