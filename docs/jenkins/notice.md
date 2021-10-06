# Jenkins配置通知
## Jenknis配置邮件通知
### 一、设置邮箱开启 POP3/SMTP/IMAP设置
![20211006105445](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211006105445.png)
### 二、Jenkins上安装邮件相关插件
安装插件`Email Extension Template`用于设置邮件模板
![20211006105825](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211006105825.png)
### 三、配置系统默认邮箱
在**系统管理**->**系统设置**中进行配置:
* 配置Jenkins location
![20211006110117](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211006110117.png)
* 配置扩展邮件通知
![20211006110634](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211006110634.png)
    * SMTP Server: smtp服务器
    * SMTP Username： 用户邮箱
    * SMTP Password： 邮箱授权码
    * Default user e-mail suffix: 默认邮箱后缀
    * Default Content Type: 邮件文本格式
### 四、测试发送邮件
* 新建一个流水线项目
* 配置pipeline脚本
```grovvy
    post {
        success {
            emailext (
                subject: "[${env.JOB_NAME}] The build [${env.BUILD_NUMBER}] is success.",
                body: """<li> Job Name: ${env.JOB_NAME} [${env.BUILD_NUMBER}]</li>
                         <li> Job URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>""",
                to: "879423371@qq.com",
                from: "z879423371@163.com"
            )
        }
        failure {
            emailext (
                subject: "[${env.JOB_NAME}] The build [${env.BUILD_NUMBER}] is failed.",
                body: """<li> Job Name: ${env.JOB_NAME} [${env.BUILD_NUMBER}]</li>
                         <li> Job URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>""",
                to: "879423371@qq.com",
                from: "z879423371@163.com"
            )
        }
```

* 构建触发任务
查看日志，已经构建成功
![20211006160601](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211006160601.png)

登录邮箱，可以收到邮件
![20211006155947](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211006155947.png)

## Jenkins配置钉钉通知