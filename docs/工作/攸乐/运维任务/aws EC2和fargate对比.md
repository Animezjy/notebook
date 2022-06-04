## 名词解释
### EC2
基于虚机的云服务器
### Fargate
无需管理服务器或集群即可运行容器的技术，只用关心应用镜像及其所需的资源即可
在aws上具体产品为[ECS](https://aws.amazon.com/cn/ecs/) 和[EKS](https://aws.amazon.com/cn/eks/)


1.  AWS 对于实例收费分为 Reserved Instance(RI)  和 On Demand(OD) 两种方式，其中 RI 为，一般情况下 RI 相比 OD 都会节省 60%多的费用，所以对于稳定且运行时间较长的业务一定要选择 RI。
    
2.  不同代的机型收费不一样，例如 RI 中 m5.xlarge 的 ￥516.11/月与 m4.xlarge 的 ￥764.12/月对比节省了大约 32.5%，所以要关注不同代机型的价格，基本都是最新一代的比上一代的便宜，升级过程中需要注意 kernel 版本较低的需要先升级 kernel 再替换机型，否则更换机型会失败。


## EC2 Instance vs Fargate




### 计价方式
-   Fargate 总费用 (以资源为单位) = vCPU 总费用 + 内存总费用
    
    -   vCPU 总费用 = vCPU 数 x 每 CPU-秒价格 x 使用CPU持续时间 (秒)
        
    -   内存总费用 = 任务数 x 内存数 (GB) x 每 GB 价格 x 每天内存持续时间 (秒) x 天数
        
-   EC2 Instance 总费用（以Instance为单位 = Instance Type的单价/小时 x 小时数
    
以公司在用的*parrot*服务使用的资源对以上两种模式



计费模式

EC2：
* OnDemand(按需付费)： 根据实例类型的单价 和使用时长来计算价格
* Reserved Instance(预留实例模式)： 用户向 AWS 承诺使用某一机型一段的时间，同时 AWS 会给出相应的折扣
* Spot(投标模式)
* Compute Savings Plan

Fargate：





|c6a


已上所有数据对比均以




一个 EKS 集群由一个 control plane 和 EC2 或者 Fargate 组成的计算资源构成。

control plane 的费用应不同地区而不同，中国区是每个 EKS 集群 0.688CNY/小时。

EC2 或者 Fargate 组成的计算资源的费用，按 EC2 和 Fargate 各自的标准分别计算。

可以看到 EKS 的集群既使没有工作节点时也是按小时收费的。

这与 Fargate 不同，Fargate 在建了集群但没有运行 task 的情况下是不收费的。

