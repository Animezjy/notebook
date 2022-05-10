* k8s中的CI/CD实现

主要工具
>gilab
>harbor
>jenkins
>kubernetes





* 非k8s的CI/CD
CI: gitlab上打tag-->触发jenkins任务，将本次tag中的代码进行构建-->产出物上传至多个指定的存储位置
CD: 将本次要更新的服务包从存储上拉取下来-->同步到要部署的服务器上-->解压部署
工具包: 业务服务相关的操作都由工具包提供，例如：服务启动/停止 重启等，  业务上的操作  设置开服时间 刷新zk中的资产信息等

>gitlab
>jenkins
>ansible
>tools