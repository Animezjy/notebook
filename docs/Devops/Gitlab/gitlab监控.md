
官方架构图:

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204011510849.png)



`gitaly`: 后台服务，专门负责访问磁盘以高效处理 gitlab-shell 和 gitlab-workhorse 的git 操作，并缓存耗时操作。所有的 git 操作都通过 Gitaly 处理，并向 GitLab web 应用程序提供一个 API，以从 git（例如 title, branches, tags, other meta data）获取属性，并获取 blob（例如 diffs，commits，files）


`gitlab-workhorse`: 轻量级反向代理服务器，可以处理一些大的HTTP请求（磁盘上的 CSS、JS 文件、文件上传下载等），处理 Git Push/Pull 请求，处理到Rails 的连接会反向代理给后端的unicorn（修改由 Rails 发送的响应或发送给 Rails 的请求，管理 Rails 的长期 WebSocket 连接等）。

`unicorn`：Gitlab 自身的 Web 服务器(Ruby Web Server)，包含了 Gitlab 主进程，负责处理快速/一般任务，与 Redis 一起工作，配置参考：`CPU核心数 + 1 = unicorn workers数量`。工作内容包括：

-   通过检查存储在 Redis 中的用户会话来检查权限
-   为 Sidekiq 制作任务
-   从仓库（warehouse）取东西或在那里移动东西

> 从gitlab`13.0`版本之后，unicorn组件被`puma`组件所替代


`Sidekiq`：后台核心服务，可以从redis队列中提取作业并对其进行处理。后台作业允许GitLab通过将工作移至后台来提供更快的请求/响应周期。Sidekiq任务需要来自Redis



![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202204011511331.png)
