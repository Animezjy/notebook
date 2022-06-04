## 目录
* session机制
* 上下文
* 钩子


flask中session和cookie的关系

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202205311805787.png)


设置和读取cookie
```python
from flask import make_response
@app.route("/set_cookie")  
def set_cookie():  
    resp = make_response("success")  
    # 设置cookie，默认有效期是临时cookie，浏览器关闭时失效  
    resp.set_cookie("type", "Python", max_age=3600)  
    return resp  
  
  
@app.route("/get_cookie")  
def get_cookie():  
    c = request.cookies.get("type")  
    print(c)  
    return "cookie is %s" % c  
  
  
@app.route("/delete_cookie")  
def get_cookie():  
    resp = make_response("del success")  
    # 删除cookie  
    resp.delete_cookie("type")  
    return resp

```
#### session机制
```python
from flask import session
# flask的session使用的秘钥字符串 ，如果缺少，程序会报错，如下图所示
app.config["SECRET_KEY"] = "fajfiasqnxixj234dkDSHFO#a"

@app.route("/login")  
def login():  
    # 设置session数据  
    session["name"] = "python"  
    session["mobile"] = "17831234235"  
    return "login success"  
  
  
@app.route("/index")  
def index():  
    # 获取session数据  
    name = session.get("name")  
    if name:  
    return "当前登录的用户是 %s" % name  
    else:  
    return "用户未登录"
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202205311756237.png)


#### 请求上下文
**request** 和 **session** 都属于请求上下文对象



#### 应用上下文
**current_app** 和**g**都属于应用上下文对象
* current_app: 表示当前运行程序文件的程序实例。
* g: 处理请求时，用于临时存储的对象，每次请求都会重设这个变量。

```python
from flask import g

@app.route("/index")
def index():
    g.username = "xxx"
    return "Index page"

```


#### 请求钩子

请求钩子是通过装饰器的形式实现，Flask支持4种请求钩子

* before_first_request: 在处理第一个请求之前运行
```python  
@app.before_first_request  
def handle_before_first_request():  
    """在第一次请求处理之前先被执行"""  
    print("handle_before_first被执行")  
```
* before_request: 在每次请求前运行

```python
@app.before_request  
def handle_before_request():  
    print("在每次请求前都被执行")
```
* after_request(response): 如果没有处理的异常抛出，在每次请求后运行

**会自动传入response对象作为参数，同时必须返回一个response对象**
```python
@app.after_request  
def handle_after_request(response):  
    """在每次请求之后都被执行，前提是视图函数没有出现异常"""  
    print("handle_after_request被执行")  
    return response  
```
* teardown_request(response): 在每次请求后运行，即使有未处理的异常
```python
@app.teardown_request  
def handle_teardown_request(response):  
    """在每次请求之后被执行，无论视图是否出现异常都会执行"""  
    print("handle_teardown_request被执行")  
    return response
```


#### Flask-Script扩展
```python
 pip install Flask-Script
```


> flask_script 报错：ModuleNotFoundError: No module named 'flask._compat'解决方法

尝试修改一下`flask_script/__init__.py`中`from ._compat import text_type` 改成 `from flask_script._compat import text_type` 。

```python

# coding:utf-8  
from flask import Flask, make_response, request, session, current_app, g  
from flask_script import Manager  
  
app = Flask(__name__)  
  
# 创建Manage管理对象  
manager = Manager(app)  
  
  
@app.route("/index")  
def index():  
    print("Index 被执行")  
    return "Index page"  
  
  
if __name__ == '__main__':  
    # app.run(debug=True)  
    # 通过管理对象启动flask  
    manager.run()
```


