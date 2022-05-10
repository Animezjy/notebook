---
tags: 学习/运维技术/Linux大杂烩
---

```shell
   

#!/bin/bash

yum -y install telnet.x86_64 telnet-server xinetd

cat << EOF > /etc/xinetd.d/telnet

# default: yes

# description: The telnet server servestelnet sessions; it uses \

# unencrypted username/password pairs for authentication.

service telnet

{

flags = REUSE

socket_type = stream

wait = no

user = root

server =/usr/sbin/in.telnetd

log_on_failure += USERID

disable = no

}

EOF

systemctl restart xinetd
```