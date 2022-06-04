
## 背景
游戏在开发阶段会有大量的打包操作，当前公司的CI/CD任务都是依托于Jenkins平台执行。




* 
* 构建任务速度慢
当前的操作流程为:
* 项目组购置打包机
* devops对打包机进行初始化，并录入Jenkins平台
* 任务

随着游戏项目的增加，Jenkins平台的使用也越来越频繁，运行在上面的任务也急剧增加。


针对以上问题，支撑部做了技术调研，Jenkins有一Kubernetes插件，可以支持将任务调度到Kubernetes集群中，在任务结束时，销毁Slave节点。

希望将服务端的CI任务由原来的物理打包机执行改为在kubernetes中执行





CI任务各个阶段运行时长对比

* 普通Jenkins Slave节点



稳定性对比


## 后续


后续会对Jenkins Kubernetes插件持续优化，






