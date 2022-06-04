## Jinja2模板

```python
from flask import Flask, render_template
@app.route("/index")
def index():
    return render_template("index.html")](<from flask import Flask, current_app, g, request, render_template

app = Flask(__name__)


#@app.route("/")
#def index():
#    return render_template("index.html", name="python", age=18)

@app.route("/")
def index():  
    data = {  
        "name": "python",  
        "age": 18,  
        "my_dict": {"city":"beijing"},  
        "my_list": [1, 2, 3, 4, 5],  
        "my_int": 0  
} 
    return render_template("index.html", **data)
```

```html
<p>{{ my_dict.city }}</p>
<p>{{ mylist[1] }}</p>
```
## 过滤器
safe: 禁用转义
```html
<p>{{ '<em>hello</em>' |safe }}</p>
```
* trim:  把值的收尾空格去掉

```html
<p>{{ "flask world   " | trim |upper }}a</p>
```
* title：把值中的每个单词的首字母都转成大写
* reverse：字符串反转
......


#### 自定义过滤器

方式一：
```python

def list_filter(alist):  
    """自定义过滤器"""  
    return alist[::2]  
# 注册过滤器  
app.add_template_filter(list_filter, "list2")
```

```html
<p>{{ my_list | list2 }}</p>
```



## 表单
```python
pip install Flask-WTF
from wtforms import (  
    Form,  
    validators,  
    StringField,  
    PasswordField,  
    SubmitField,  
)  
  
  
class RegisterForm(Form):  
    username = StringField(label=u"用户名", validators=[validators.DataRequired(u"用户名不能为空")])  
    password = PasswordField(label=u"密码", validators=[validators.DataRequired(u"密码不能为空")])  
    password2 = PasswordField(label=u"确认密码", validators=[validators.DataRequired(u"确认密码不能为空"),  
    validators.EqualTo("password", u"密码不一致")])  
    submit = SubmitField(label=u"提交")
```



## 模板宏
不带参数宏的定义与使用

```html
{% macro input() %}  
    <input type="text" value="" size="30">  
{% endmacro %}  
  
<h1>input 1</h1>  
{{ input() }}  
<h1>input 2</h1>  
{{ input() }}
```


接收参数的宏
```html
{% macro input(type="text", value="userna") %}  
    <input type="{{ type }}" value="{{ value }}" size="30">  
{% endmacro %}  
  
<h1>input 1</h1>  
{{ input(type) }}  
<h1>input 2</h1>  
{{ input(type="password", value="password") }}

```

宏定义在外部的使用

```html
# 新建一个文件，专门用来存放宏模板

使用的时候在文件中导入即可
{% import "macro_input.html" as m_input %}

```

## 模板继承
为了重用模板中的公共内容。一般在网站的顶部菜单、底部这些内容会定义在父模板中，子模板直接继承使用，不需要重写

**父模板**
base.html
```html
{% block top %}
    顶部菜单
{% endblock %}
{% block content %}

{% endblock %}

```

子模板
```html
{% extends 'base.html' %}
{% block content}
{% endblock %}
```
在jinja2中，除了继承方法，还支持一种代码重用的功能， 叫做**include**。它可以将另一个模板整体加载到当前的模板中，并进行渲染。
使用方法

```html
{% include "xxx.html" %}
```

在使用时，如果包含的模板不存在，程序会抛出**TemplateNotFound**的异常，加上**ignore 
missing**关键字可以解决
eg:

```html
{% include "tag.html" ignore missing %}
```

## Flask中的特殊变量和方法
在Flask中，有一些特殊变量和方法可以直接在模板文件中使用

**config**

```python
# config对象是Flask的Config对象，
{{ config.SQLALCHEMY_DATABASE_URI }}
```

**request**
url_for


**get_flashed_message**
类似消息队列，它可以返回之前在Flask中通过flash()传入的信息列表。把字符串对象表示的消
息加入到一个消息队列中，然后用该方法将其取出。


```python
def index():  
    if flag:  
    flash("hello flash")  
    flash("hello flash1")  
    flash("hello flash2")
```

```html




{% for message in get_flashed_message() %}
    {{ message }}
{% endfor %}
```