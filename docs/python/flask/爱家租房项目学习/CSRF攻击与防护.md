## 一、什么是CSRF

**CSRF（Cross-Site Request Forgery）**,跨站请求为伪造攻击，是常见的web攻击手段之一。
它的工作原理如下:

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202206050953940.png)

触发CSRF攻击的两个条件：
* 用户访问站点A并产生了cookie
* 用户没有退出A同时访问了B

## 二、Flask框架中的防护机制
原理：
从cookie中获取一个csrf_token的值，从请求体重新获取一个csrf_token的值，如果两者相同，则检验通过，否则检验失败，会向前端返回状态码400的错误

在flask程序中引入csrf防护机制

```python
from flask_wtf import csrf
# 创建一个csrf_token值  
csrf_token = csrf.generate_csrf()
# flask提供的返回静态文件的方法  
resp = make_response(current_app.send_static_file(html_file_name))
# 设置cookie值  
resp.set_cookie("csrf_token", csrf_token)
```
