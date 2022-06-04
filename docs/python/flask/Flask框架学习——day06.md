
## Flask发送邮件

Flask的扩展包**Flask-Mail**包含了python内部的smtplib包，可以用在Flask框架中发送邮件

```python
pip install flask-mail

from flask_mail import Mail, Message

app.config.update(
    MAIL_SERVER="smtp.163.com"
    MAIL_PORT= xxx
    MAIL_USE_TLS = True
    MAIL_USERNAME = ""
    MAIL_PASSWORD = "授权码"
)

mail = Mail(app)

@app.route("/")
def index():
    msg = Message("This is a test", sender="xxx@qq.com", recipients = ["xxx@qq.com"])
    # 邮件美容
    msg.body = "Flask test Mail"
    # 发送邮件
    mail.send(msg)
    print("Mail sent")
    return "Send Success"
```


## 蓝图
在学习Flask框架的过程中，所有的视图函数、模型类都是在单个文件中完成的。随着业务逻辑的复杂，代码会越来越多，这显然是不利于后期开发和维护的。我们需要一个方法来组织划分我们的代码，就像Django中划分的多个app、模块。
Flask中内置了一个模块化处理的类——蓝图（BluePrint）



使用装饰器解决模块分割的问题
```python

from flask import Flask
from goods import get_goods


app = Flask(__name__)

app.route("/get_goods")(get_goods)

```

### 蓝图的基本定义与使用

**app.py**

```python
from orders import app_orders  
  
app = Flask(__name__)  
  
# 注册蓝图  
app.register_blueprint(app_orders)
```

**orders.py**

```python
from flask import Blueprint  

# 创建一个蓝图对象
app_orders = Blueprint("orders", __name__)  
  
  
@app_orders.route("/get_orders")  
def get_orders():  
    return "get orders page"
```

### 以目录形式定义蓝图

```python
# 在注册蓝图时添加一个参数
app.register_blueprint(app_orders, url_prefix="/orders")
```

### 使用目录的方式引入蓝图
创建一个python包，然后在**__init__.py**中去创建蓝图

```python
# coding: utf-8  
  
from flask import Blueprint  
  
app_cart = Blueprint("app_cart", __name__, template_folder="templates", static_folder="static")  
  
from cart.views import get_cart
```


## 单元测试

测试从软件开发的过程中可以分为：单元测试、集成测试、系统测试等。在众多的测试中，与程序开发人员最密切的就是单元测试，因为单元测试是由开发人员进行的。而其他测试都由专业的测试人员来完成。所以我们主要学习单元测试。

### 什么是单元测试

单元测试就是程序开发者编写一小段代码，检验目标代码的功能是否符合预期。通常情况下，单元测试主要面向一些功能单一的模块进行。

#### python中的单元测试

assert 关键字

```python
def add_num(num1, num2):
    # 断言后面的语句如果为假，程序会抛出异常Assertionerror
    assert isinstance(num1, int)
    assert isinstance(num2, int)
    assert num2 !=0
    print(num1 + num2)
    return num1+num2

```

demo.py
```python
import unittest
class TestClass(unittest.TestCase):
    # 该方法会首先执行，测试前的准备工作
    def setUp(self):
        pass
    # 该方法会在测试代码执行完之后执行
    def tearDown(self):
        pass
    # 测试代码的名称必须以test开头
    def test_app_exists(self):
        pass    
```



#### flask中引入单元测试

```python
import unittest  
from login import app  
import json  
  
  
class LoginTest(unittest.TestCase):  
    """构造单元测试案例"""  
  
    def test_empty_user_password(self):  
    """测试用户名密码不完整"""  
    client = app.test_client()  
    # 利用客户端模拟发送请求  
    ret = client.post("/login", data={})  
    # ret是视图返回的响应对象  
    resp = json.loads(ret.data)  
    # 进行断言测试  
    self.assertIn("code", resp)  
    self.assertEqual(resp["code"], 1)  
  
  
if __name__ == '__main__':  
    unittest.main()
```

## 部署


