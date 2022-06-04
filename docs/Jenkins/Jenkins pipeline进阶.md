
## 背景
在工作过程中开发人员提出的需求
问题：

-   一个分支同时触发了多个jenkins任务，由于网络等其他原因，导致前一次触发的任务执行速度较慢，新的任务执行完之后，旧的任务才执行完成，这样一来就出现了旧任务的产出覆盖了新任务的产出的问题。

## 解决方案

### 方案一

修改构建镜像的脚本，将每次gitlab提交的**commit_id**做为最后jenkins任务产出镜像的版本号，这样每次提交的**commit_id**唯一，就保证了每次的产出物版本不同，自然就不会出现覆盖的问题。

  

由于项目组中有一部分同事不熟悉**commit_id**机制，该方案最终废弃。

### 方案二

通过修改**Jenkins pipeline**脚本，在每次构建任务之前，先判断当前所有正在构建的任务中是否和本次构建的分支相同，若相同，则保留最新的任务。这样保证每次构建任务时，同一个分支只有一个任务在执行。

部分关键脚本如下

......
    
        stage('Setup') {
            // Setup阶段设置前置条件，准备必要的环境。 如：
            // 创建的目录，检出代码，等。
            steps {
                script {
                    currentBuild.displayName = "#${BUILD_NUMBER} (${env.gitlabTargetBranch})"
                    JOB_NAME = env.JOB_NAME
                    final long CURRENT_TIME = System.currentTimeMillis() // 获取当前系统时间
                    final int BENCH_MARK    = 1*2*60*60*1000
                    branch_name = "${env.gitlabTargetBranch}"
                    def job = Jenkins.instance.getItemByFullName( JOB_NAME )
                    def builds = job.getBuilds().byTimestamp( CURRENT_TIME - BENCH_MARK, CURRENT_TIME ) // 获取2小时内的构建任务
                    for( build in job.getBuilds()) {
                        if (build.isBuilding()) {
                            /*获取当前任务的构建参数*/
                          String parameters = build?.actions.find{ it instanceof ParametersAction }?.parameters?.collectEntries {
                                [ it.name, it.value ]
                                }.collect { k, v -> "${v}" }.join('\n')
                                
                                 if (branch_name == "${parameters}") {
                                     if (env.BUILD_NUMBER > "${build.getId()}") {
                                         build.doKill()  
                                     }
                                 }
                        }
                    }
                    
                    
                }
               ......