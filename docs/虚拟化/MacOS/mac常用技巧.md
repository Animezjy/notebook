---
tags: 生活/电脑使用
---

## 常用软件安装
* scroll reverser （翻转鼠标）
* alfred(快速搜索)


## 使用技巧
macOS下微信双开

```shell
open -n /Applications/WeChat.app/Contents/MacOS/WeChat
```

**MacOS在根目录下创建目录**

```txt
1、创建一个可达的目录，比如 /Users/user/data

2、以root用户权限编辑(若无则新建) /etc/synthetic.conf

以在根目录/下创建data 目录为例(TAB分隔),新增一行加入以下内容:

data    /Users/user/data

3、重启生效
```

**制作macos镜像**
```shell

$ hdiutil create -o /tmp/MacBigSur -size 15000m -volname MacBigSur -layout SPUD -fs HFS+J

$ hdiutil attach /tmp/MacBigSur.dmg -noverify -mountpoint /Volumes/MacBigSur

$ sudo /Applications/Install\ macOS\ Big\ Sur.app/Contents/Resources/createinstallmedia --volume /Volumes/MacBigSur --nointeraction

Erasing disk: 0%... 10%... 20%... 30%... 100%

Copying to disk: 0%... 10%... 20%... 30%... 40%... 50%... 60%... 70%... 80%... 90%... 100%

Making disk bootable...

Install media now available at "/Volumes/Install macOS Big Sur"
```

**`brew`替换国内镜像源**
```shell
# 替换brew.git:

cd "$(brew --repo)"

git remote set-url origin [https://mirrors.ustc.edu.cn/brew.git](https://mirrors.ustc.edu.cn/brew.git)

# 替换homebrew-core.git:

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"

git remote set-url origin [https://mirrors.ustc.edu.cn/homebrew-core.git](https://mirrors.ustc.edu.cn/homebrew-core.git)

# 替换homebrew-cask.git:

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-cask"

git remote set-url origin [https://mirrors.ustc.edu.cn/homebrew-cask.git](https://mirrors.ustc.edu.cn/homebrew-cask.git)

# 应用生效

brew update

# 替换homebrew-bottles 在~/.zshrc中添加

export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles
```