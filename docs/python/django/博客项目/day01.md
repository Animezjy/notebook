# **Models**

Django会为在`models.py`文件中定义的每一个类，在数据库中创建对应的数据表。Django为创建和操作数据模型提供了一系列便捷的API（Django ORM）





```python
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Post(models.Model):
    STATUS_CHOICES = (('draft', 'Draft'), (('published', 'Published')))
    title = models.CharField(max_length=250, verbose_name="博客标题")
    slag = models.SlugField(max_length=250, unique_for_date='publish')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blog_posts", verbose_name="作者")
    body = models.TextField(verbose_name="博客内容")
    publish = models.DateTimeField(default=timezone.now, verbose_name="发布时间")
    created = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft', verbose_name="状态")


    class Meta:
        pass
```



* slug字段：

