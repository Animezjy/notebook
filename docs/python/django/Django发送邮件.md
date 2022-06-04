
在settings中进行如下配置

```python
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'your_account@gmail.com'
EMAIL_HOST_PASSWORD = 'your_password'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
```

如果无法使用任何SMTP服务器，则可以将邮件打印在命令行窗口中，在`settings.py`中加入下列这行：

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

在django提供的shell环境中进行测试

```python
from django.core.mail import send_mail

send_mail('Django mail', 'This email was sent with Django', 'z879423371@gmail.com', ['z879423371@gmail.com'], fail_silently=False)
Content-Type: text/plain; charset="utf-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Subject: Django mail
From: z879423371@gmail.com
To: z879423371@gmail.com
Date: Wed, 28 Jul 2021 15:54:36 -0000
Message-ID: 
 <162748767631.89012.15980041880498795531@topjoys-MacBook-Pro.local>
This email was sent with Django
------------------------------------------------------------------------------
```


