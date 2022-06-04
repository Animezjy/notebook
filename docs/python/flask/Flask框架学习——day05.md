## 数据库

* Flask-SQLALchemy安装
* 连接数据库
* 使用数据库
* 数据库迁移
* 邮件扩展

### FlaskSQLALchemy安装

SQLALchemy是一个关系型数据库框架，它提供了高层的ORM和底层的原生数据库的操作。flask-sqlalchemy是一个简化了SQLALchemy操作的flask扩展

```shell
pip install flask-sqlalchemy
# 如果需要操作mysql数据库，还需要安装flask-mysqldb
pip install flask-mysqldb
```
### 连接数据库

使用Flask-SQLAlchemy操作数据库，首先要建立数据库连接。这需要通过URL指定，而且程序使用的数据库必须保存到Flask配置对象的SQLALCHEMY_DATABASE_URI键中。

··

```python
# 设置连接数据库的URL
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://mysql:mysql_password@192.168.1.135:3306/test1"
# 设置每次请求结束后会自动提交数据库中的改动
app.config["SQLALCHEMY_COMMIT_ON_TEARDOWN"] = True

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

# 查询时会显示原始sql语句
app.config["SQLALCHEMY_ECHO"] = True


```


### 创建sqlalchemy对象，操作数据库
```python
from flask_sqlalchemy import SQLAlchemy

# 创建数据库sqlalchemy对象  
db = SQLAlchemy(app)  

class Role(db.Model):  
    """用户身份表"""  
    __tablename__ = "tbl_roles"  
    id = db.Column(db.Integer, primary_key=True)  # 整型的主键，会默认设置为自增主键  
    name = db.Column(db.String(20), unique=True)  
  
  
class User(db.Model):  
    # 数据库的表名  
    ___tablename__ = "tbl_user"  
    id = db.Column(db.Integer, primary_key=True)  # 整型的主键，会默认设置为自增主键  
    username = db.Column(db.String(64), unique=True)  
    password = db.Column(db.String(127))  
    email = db.Column(db.String(28), unique=True)  
    role_id = db.Column(db.Integer, db.ForeignKey("tbl_roles.id"))](<db = SQLAlchemy(app)


class Role(db.Model):
    """用户身份表"""
    __tablename__ = "tbl_roles"
    id = db.Column(db.Integer, primary_key=True)  # 整型的主键，会默认设置为自增主键
    name = db.Column(db.String(20), unique=True)

    # relationship方法是为了查询方便，不会把字段真正存入数据库，backref是反推的功能
    users = db.relationship("User", backref="role")


class User(db.Model):
    # 数据库的表名
    ___tablename__ = "tbl_user"
    id = db.Column(db.Integer, primary_key=True)  # 整型的主键，会默认设置为自增主键
    username = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(127))
    email = db.Column(db.String(28), unique=True)
    role_id = db.Column(db.Integer, db.ForeignKey("tbl_roles.id"))
 
```


### 添加数据

```python
# 创建对象  
role1 = Role(name="admin")  
# 用session记录对象任务  
db.session.add(role1)  
# 提交任务到数据库中  
db.session.commit()




role2 = Role(name="stuff")  
us1 = User(username="zhangjiyou", password="123456", email="zhangjiyou@topjoy.com", role_id=role1.id)  
us2 = User(username="bigben", password="123456", email="bigben@topjoy.com", role_id=role2.id)
# 一次保存多条数据
db.session.add_all([us1, us2])
```


### 查询数据

#### 常用的sqlalchemy查询过滤器

|名称|说明|
|--|--|
|filter()|把过滤器添加到原查询上，返回一个新查询|
|filter_by()|把等值过滤器添加到原查询上,返回一个新查询|
|limit|使用指定的值限定原查询返回的结果|
|offset()|偏移原查询返回的结果，返回一个新查询|
|order_by()|根据指定条件对原查询结果进行排序，返回一个新查询|
|group_by()|根据指定条件对原查询结果进行分组，返回一个新查询|



```python
# 查询所有数据
Role.query.all()
db.session.query(Role).all()

# 根据主键id获取对象
r = Role.query.get(2)
r.name

# 过滤
user = User.query.filter_by(username="zhangjiyou").all()
user = User.query.filter(User.username=="zhangjiyou").first()

# 通过或操作进行过滤

from sqlalchemy import or_
User.query.filter(or_(User.username=="zhangjiyou", User.email=="bigben@topjoy.com")).all()



# 倒序排列
User.query.order_by(User.id.desc())
from sqlalchemy import func
# 分组查询
db.session.query(User.username, User.role_id, func.count(User.role_id)).group_by(User.role_id).all()
# 等同于下面的语句
select username, role_id, count(*) from user group by role_id;

#关联查询与自定义显示信息  查询规则表中规则satff对应的所有用户
ro = Role.query.get(2)
ro.users   # 由于定义了relationship，因此可以直接通过点调用来拿到关联的表数据

# 查询用户表中id为1的用户对应的角色
Role.query.get(User.query.get(1).role_id) # 这是没有添加backref字段的用法
User.query.get(1).role  # 添加了backref的用法


```

自定义显示信息

```python
# 类似django中的__str__
def __repr__(self):  
    """定义之后，可以让显示对象的时候更直观"""  
    return self.name
```


## 数据的修改和删除

```python
# 修改数据
User.query.filter_by(username="python").update({"username":"bigben", email:"big@topjoy.com"})
db.session.add(User)
db.session.commit()


# 删除数据
In [30]: user = User.query.get(3)

In [31]: db.session.delete(user)

In [32]: db.session.commit()


```



### 数据库迁移
flask框架的其中一个扩展提供了数据库迁移的一些列命令
使用方法如下

```python
pip install flask-migrate
```

```python
# 新版本flask-migrate的使用
[Flask_migrate最新攻略，教你怎么优雅的使用Flask_migrate_0xJohnson的博客-CSDN博客](https://blog.csdn.net/weixin_37871966/article/details/122402528)
 ```


```python

flask db init
flask db migrate # 等同于django中的 makemigrations
flask db upgrade # 真正的迁移文件
```

