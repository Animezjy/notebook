#### 获取请求参数


```python
# request中包含了前端发送过来的所有请求信息  
# 通过request.form可以直接提取请求体中的表单格式的数据，是一个类字典的对象  
# 通过get方法只能拿到一个多个同名参数的第一个值  
name = request.form.get("name")  
age = request.form.get("age")  
  
# args是用来提取url中的参数（查询字符串）  
city = request.args.get("city")  
print("request.data: %s" % request.data)  
print(request.args)
```

|属性|说明|类型|
|---|---|---|
|data|记录请求的数据，并转换为字符串|\*|
|form|记录请求中的表单数据|MultiDict|
|args|记录请求中的查询参数|MultiDict|
|cookies|记录请求中的cookie信息|Dict|
|headers|记录请求中的报文头|EnvironHeaders|
|method|记录使用的HTTP方法|GET/POST|
|url|记录请求的URL地址|string|
|files|记录请求上传的文件|\*|

#### 上传文件
```python

f = request.files.get("avator")  
f.save("./1.png")
```

####  abort函数终止
```python
from flask import abort, Response
@app.route('/login', methods=["POST"])  
def login():  
    name = request.form.get("name")  
    pwd = request.form.get("password")  
    if name == "zhangsan" and pwd == "admin":  
    return "Login success"  
    else:  
    # 使用abort函数可以立即终止视图函数的执行，并且返回给前端特定的信息  
    # 1.传递状态码信息
    # abort(400)
    # 2. 传递响应体信息
    # abort(Response("login failed")  # 这种方法不常用
```
#### 自定义异常处理
```python
@app.errorhandler(404)  
def handle_404_error(error):  
    """自定义的处理错误的方法"""  
    # 这个函数的返回值会是前端用户看到的最终结果  
    return u"出现了404错务, 错误信息 %s" % error
```

#### 视图函数中的返回值处理

```python
from flask import Flask, request  
  
app = Flask(__name__)  
  
  
@app.route('/')  
def index():  
    # 1. 使用元组返回自定义的响应信息  
    # 响应体     状态码   响应头  
    return "Index page", 301, [("itcast", "python")]


    
    # 2. 使用make_response构造响应信息  
    resp = make_response("index page 2")  
    resp.status = 202  
    resp.headers["city"] = "beijing"
    return resp
```

```shell
$ curl -I http://127.0.0.1:5000 -I
HTTP/1.1 301 MOVED PERMANENTLY
Server: Werkzeug/2.1.2 Python/3.7.9
Date: Tue, 31 May 2022 09:04:26 GMT
itcast: python
Content-Type: text/html; charset=utf-8
Content-Length: 10
Connection: close
```

![](https://zhangjiyou.oss-cn-beijing.aliyuncs.com/images/202205311704177.png)



```python
from flask import jsonify
# return json.dumps(data), 200, {"Content-Type": "application/json"}  
# 使用jsonify帮助转为json数据，并设置响应头 Content-Type为 application/json  
# return jsonify(data), 201  
return jsonify(name="张三", age=20)
```