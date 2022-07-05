



-   GOROOT：go的安装目录，类似java的jdk，存放一些内置的开发包和工具。
-   GOPATH：go指定的工作空间，用于保存go项目的代码和第三方依赖包

## 包管理工具

在go1.11之后，推出了go module的功能

一般在进行项目开发的时候，会依赖一下三种类型的包
* go语言内置的标准库，目录在`GOROOT/src`下
* 第三方包
* 自定义的包

使用go module来管理包
1. 初始化
```shell
go mod init xxx(当前工程目录) # 初始化，会在当前目录下生成一个go.mod的文件
```







### go path【不推荐使用】

go path是最早的依赖包管理方式（Go1.0），启用GOPATH模式（**注意区分GOPATH模式和GOPATH路径，这是两个语境**），要求将所有工程代码要求放在`GOPATH/src`目录下。在工程经过 `go build xxx`、`go install xxx`或 `go get xxx`等指令后，会将拉取的第三方xxx依赖包放在`GOPATH/src`目录下，产生的二进制可执行文件放在 `GOPATH/bin` 目录下，生成的中间缓存文件会被保存在 `GOPATH/pkg` 下。

问题：**GOPATH模式下没有版本控制的概念**，在执行 `go get` 的时候，获取的永远是最新的依赖包，下载到`GOPATH/src`，如果你有两个工程依赖一个包的v1和v2版本，则会发生冲突，因为 `GOPATH` 模式下两个工程内依赖的导入路径都是一样的，因此两个工程获取的都是v2版本。

命令：显然`GOPATH`模式下`go get会将代码拉取到GOPATH/src`，这个模式已经不推荐使用了。

### govendor【不推荐使用】

在 Go 1.5版本之后，Go 提供了 `GO15VENDOREXPERIMENT` 环境变量(Go 1.6版本默认开启该环境变量)和 `Govendor` 包管理工具，用于将 `go build` 时的应用路径搜索调整成为当前工程`/vendor` 目录的方式，有效的解决了不同工程使用自己独立的依赖包目录。编译 Go 代码会优先从`vendor`目录先寻找依赖包，`vendor`目录如果没有找到，然后在 `GOPATH` 中查找，都没找到最后在 `GOROOT` 中查找。

优势：因为将第三方依赖完全和工程整合，使得项目构建速度快，且可以工作在无法连接外网的CI/CD流程中。

问题：**放弃了依赖重用，使得冗余度上升**

下载：go install github.com/kardianos/govendor（govendor是第三方可执行文件，下载可执行文件用go install，用go get也行，但是会有告警）。

命令：`govendor --help`查看所有命令（要先使用go get xxx将xxx依赖下载到$GOPATH/src中，此时go vendor包管理本质是基于GOPATH模式的）

命令

功能

govendor init

初始化`vendor`目录

govendor add

添加包到`vendor`目录（相关依赖则是从$GOPATH/src中获取）

govendor add +external

添加所有外部包到`vendor`目录

govendor get

拉取依赖包`vendor`目录





[go包管理速通，一篇文章就够了，再也不用担心因为不会导包被辞退 - 白泽来了 - 博客园](https://www.cnblogs.com/YLTFY1998/p/15806085.html)