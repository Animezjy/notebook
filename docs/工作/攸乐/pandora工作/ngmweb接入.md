#工作/攸乐/项目运维/pandora 
## **背景**
游戏项目中需要用到GM系统，技术中心这边实现了一套统一的系统，各个项目组fork该项目，并根据自己需求进行修改。这套系统需要接入公司k8s的CI/CD流程

## **主要工作（OPS需要操作的）**
1. 利用 `CICD init Job`创建jenkins任务，并将其绑定到gitlab的push webhook
>具体可以查看参考文档
3. 修改项目根目录下的`_continuous_integration_delivery`目录下的两个文件
    1. delivery.yaml
        - 描述了服务部署位置
        - apollo部署集群名称空间
        - 使用chart仓库中的哪个分支和项目
        - 定义项目将用到的编排文件模板
    2. integration.yaml
        - 项目镜像推送位置 



**delivery.yaml**
```yaml
inter:  
 # kubeconfig 定义 kubectl 使用的 --kubeconfig 选项  
 # config               部署到公司 k8s  
 # config.topjoy.online 部署到公司 新k8s  
 # config.ali.staging   部署到阿里 ali.staging 环境  
 # config.ali.online    部署到阿里 ali.online 环境  
 # config.ali.jp        部署到阿里 ali.jp 环境  
 kubeconfig: config.topjoy.online  
 values_kind: apollo  
 apollo:  
 env: topjoy  
 appid: ngmweb-pandora  
 cluster: inter  
 namespace: values  
 # # values_repo 描述配置信息从哪里取得  
 # values_repo: git@git.youle.game:TC/TSD/DevOps/values.git  
 # # 从哪个分支或tag获取, 格式: tag:tagname branch:branch_name, 未填写或无该属性视为 branch:master  
 # values_from: branch:master  
 # values_path 描述配置文件的父级目录  
 values_path: ngmweb-pandora  
 # values_file 描述配置文件的相对路径  
 values_file: staging.yaml  
 # charts_repo 描述编排文件从哪里获取  
 charts_repo: git@git.youle.game:TC/TSD/DevOps/charts.git  
 # 从哪个分支或tag获取, 格式: tag:tagname branch:branch_name, 未填写或无该属性视为 branch:master  
 charts_from: branch:add_pandora_ngmweb  
 # charts_path 描述编排文件的父级目录  
 charts_path: ngmweb-pandora  
 # files_apply 描述需要渲染和应用到集群的编排文件, 建议组织好顺序  
 files_apply:  
 - 1.namespace.yaml  
 - 2.https-secret-topjoy-com.yaml  
 - 2.registry-secret-topjoy.yaml  
 - 2.registry-secret-aliyun.yaml  
 - 2.registry-secret-aliyun-vpc.yaml  
 - 4.deployment.yaml  
 - 5.service.yaml  
 - 6.ingress.yaml
```


**integration.yaml**

```yaml
ding_talk_token: 21dadc17d01971ef00344acb62c8daf03029fa8c51b800353a3aaf4c42e0f990  
version: 1.0.1  
image_name: ngmweb-pandora  
registries:  
 # 公司内部私有注册仓库地址  
 - location: topjoy  
 # 是否构建  
 build: True  
 # 推送时，到那个镜像仓库  
 push_to: registry-dev.youle.game  
 # k8s里引用时，镜像仓库地址  
 refs_as: registry-dev.youle.game  
 # 推送到哪个 repo 下  
 group: pandora  
 # 阿里云私有注册仓库地址, 对外, kubernetes 编排文件中使用  
 - location: alivpc  
 # 是否构建  
 build: True  
 # 推送时，到那个镜像仓库  
 push_to: registry.cn-hangzhou.aliyuncs.com  
 # k8s里引用时，镜像仓库地址  
 refs_as: registry-vpc.cn-hangzhou.aliyuncs.com  
 # 推送到哪个 repo 下  
 group: topjoy
```


**平台配置**

1. 登录apollo平台，新创建一个项目，并配置好namespace、集群等信息（此处可以参考已接入好的项目\
2. 创建项目管理秘钥
![](https://gitee.com/animezjy/PicGo_img/raw/master/images/202203091511917.png)
3. 登录jenkins-slave机器`172.16.153.61`，切换到jenkins用户，在`~/.secrets/config.yaml`中追加apollo中的管理秘钥




**参考文档**
[k8s ci/cd接入](https://topjoy.yuque.com/tsd/tcblvy/zsb0ao)