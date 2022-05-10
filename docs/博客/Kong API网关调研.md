#学习/运维技术/kubernetes

### 需求背景

当前公司内部使用的HTTP服务，通过172.16.152.9 上的Nginx做统一的转发和http转https的证书绑定。

当需要添加一个域名时，需要登录到服务器上，手动配置，会造成服务之间的干扰和权限分配混乱的问题。

希望通过一个Web UI的方式简化配置，并能够提供流量监控等高级功能



### Kong简介

Kong是一个在Nginx中运行的Lua应用程序，可以通过lua-nginx模块实现，Kong不是用这个模块编译Nginx，而是与OpenRestry一起发布，OpenRestry已经包含了lua-nginx-module，OpenRestry是Nginx的一组扩展功能模块。





### 相关术语

- Route：是请求的转发规则，按照Hostname和PATH，将请求转发给Service。
- Services：是多个Upstream的集合，是Route的转发目标。

- Consumer：是API的用户，里面记录用户的一些信息。
- Plugin：是插件，plugin可以是全局的，绑定到Service，绑定到Router，绑定到Consumer。

- Certificate：是https证书。
- Sni：是域名与Certificate的绑定，指定了一个域名对应的https证书。

- Upstream：是负载均衡策略。
- Target：是最终处理请求的Backend服务。



### Docker-Compose部署

#### 关闭Selinux

```json
# setenforce 0
# sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
```

#### 配置软件源

```json
# cat /etc/yum.repos.d/epel.repo
[epel]
name=Extra Packages for Enterprise Linux 7 - $basearch
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=$basearch
failovermethod=priority
enabled=1
gpgcheck=0

[docker-ce-stable]
name=Docker CE Stable - $basearch
baseurl=https://download.docker.com/linux/centos/7/$basearch/stable
enabled=1
gpgcheck=0

[epel]
name=Extra Packages for Enterprise Linux 7 - $basearch
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=$basearch
failovermethod=priority
enabled=1
gpgcheck=0
```

#### 安装Docker及Docker-compose

```json
# yum install docker-ce docker-compose
# systemctl enable docker
# systemctl start docker
```



#### 创建Docker-compose.yaml

```json
version: '3'

services:

  kong-database:
    image: postgres:9.6
    container_name: kong-database
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=kong
      - POSTGRES_DB=kong
      - POSTGRES_PASSWORD=kong
    networks:
      - kong-net
    volumes:
      - "db-data-kong-postgres:/var/lib/postgresql/data"

  kong-migrations:
    image: kong
    environment:
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=kong-database
      - KONG_PG_PASSWORD=kong
      - KONG_CASSANDRA_CONTACT_POINTS=kong-database
    command: kong migrations bootstrap
    restart: on-failure
    networks:
      - kong-net
    depends_on:
      - kong-database

  kong:
    image: kong:centos
    container_name: kong
    cap_add:
      - NET_BIND_SERVICE
    environment:
      - LC_CTYPE=en_US.UTF-8
      - LC_ALL=en_US.UTF-8
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=kong-database
      - KONG_PG_USER = kong
      - KONG_PG_PASSWORD=kong
      - KONG_CASSANDRA_CONTACT_POINTS=kong-database
      - KONG_PROXY_ACCESS_LOG=/dev/stdout
      - KONG_ADMIN_ACCESS_LOG=/dev/stdout
      - KONG_PROXY_ERROR_LOG=/dev/stderr
      - KONG_ADMIN_ERROR_LOG=/dev/stderr
      - KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl
    restart: on-failure
    ports:
      - 80:8000
      - 443:8443
      - 8001:8001
      - 8444:8444
    links:
      - kong-database:kong-database
    networks:
      - kong-net
    depends_on:
      - kong-migrations

  konga:
    image: pantsel/konga
    ports:
      - 1337:1337
    links:
      - kong:kong
    container_name: konga
    environment:
      - NODE_ENV=production

volumes:
  db-data-kong-postgres:

networks:
  kong-net:
    external: false
```



#### 启动服务

```json
# docker-compose up -d
```

#### 服务端口信息

| 服务名称     | 协议  | 对外端口 | 容器内端口 |
| ------------ | ----- | -------- | ---------- |
| Konga Web UI | http  | 1337     | 1337       |
| Kong Admin   | http  | 8001     | 8001       |
| Kong Admin   | https | 8444     | 8444       |
| Kong Service | http  | 80       | 8000       |
| Kong Service | https | 443      | 8443       |

### 配置

1. 登录http://konga:1337 创建一个管理用户

![20211210183301](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183301.png)



1. 登录后，添加后端kong服务
![20211210183411](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183411.png)



1. 添加后端服务后，可以看到全局的状态信息

![20211210183441](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183441.png)


1. 添加Service

![20211210183502](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183502.png)

1. 添加Route

![20211210183523](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183523.png)
1. 添加SNI

![20211210183617](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183617.png)
1. 在域名服务器上将Jenkins-ci.youle.game 的指向修改为Kong的服务地址即可。



### 功能扩展

#### 修改请求的header

因为在启动容器时，我们在容器内部指定的启动端口为8443，所以会导致Nginx将请求转向后端upstream服务器时的header会带有端口信息。可以通过post function插件修改当前或全局的请求信息。

![20211210183707](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183707.png)


#### 监控

可以在插件市场中，添加Prometheus的监控插件。通过管理端口的/metrics 路径获取Prometheus数据格式的监控信息。

![20211210183728](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183728.png)


```plain
# http://172.16.153.124:8001/metrics
# HELP kong_datastore_reachable Datastore reachable from Kong, 0 is unreachable
# TYPE kong_datastore_reachable gauge
kong_datastore_reachable 1
# HELP kong_memory_lua_shared_dict_bytes Allocated slabs in bytes in a shared_dict
# TYPE kong_memory_lua_shared_dict_bytes gauge
kong_memory_lua_shared_dict_bytes{shared_dict="kong"} 40960
kong_memory_lua_shared_dict_bytes{shared_dict="kong_cluster_events"} 40960
kong_memory_lua_shared_dict_bytes{shared_dict="kong_core_db_cache"} 806912
kong_memory_lua_shared_dict_bytes{shared_dict="kong_core_db_cache_miss"} 90112
kong_memory_lua_shared_dict_bytes{shared_dict="kong_db_cache"} 794624
kong_memory_lua_shared_dict_bytes{shared_dict="kong_db_cache_miss"} 86016
kong_memory_lua_shared_dict_bytes{shared_dict="kong_healthchecks"} 40960
kong_memory_lua_shared_dict_bytes{shared_dict="kong_locks"} 61440
kong_memory_lua_shared_dict_bytes{shared_dict="kong_process_events"} 45056
kong_memory_lua_shared_dict_bytes{shared_dict="kong_rate_limiting_counters"} 86016
kong_memory_lua_shared_dict_bytes{shared_dict="prometheus_metrics"} 49152
# HELP kong_memory_lua_shared_dict_total_bytes Total capacity in bytes of a shared_dict
```



通过Prometheus采集，使用Grafana做数据展示:https://grafana.com/grafana/dashboards/7424



#### 请求日志

支持多种日志上传方式
![20211210183758](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183758.png)

完整的请求内容

```plain
{"latencies":{"request":2,"kong":0,"proxy":2},"service":{"host":"172.16.153.41","created_at":1594799287,"connect_timeout":60000,"id":"6d8467c2-8893-4c86-9b08-5020ffb1f97d","protocol":"http","name":"Jenkins","read_timeout":60000,"port":8080,"updated_at":1594799318,"tags":{},"write_timeout":60000,"retries":5},"request":{"querystring":{},"size":"109","uri":"\/static\/ad8559c0\/images\/top-sticker-bottom-edge.png","url":"https:\/\/jenkins-ci.youle.game:8443\/static\/ad8559c0\/images\/top-sticker-bottom-edge.png","headers":{"host":"jenkins-ci.youle.game","accept":"image\/webp,image\/apng,image\/*,*\/*;q=0.8","sec-fetch-site":"same-origin","sec-fetch-dest":"image","cache-control":"no-cache","sec-fetch-mode":"no-cors","pragma":"no-cache","user-agent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/84.0.4147.89 Safari\/537.36","cookie":"experimentation_subject_id=ImE4OGUwY2IxLWE4ZjEtNDc4OS05NzFlLTQ3ODZkY2RlZTYxZCI%3D--3c7624861dce5acfb4dc6f978fe1b3f7d1f49530; _ga=GA1.2.1173104791.1588061723; _fbp=fb.1.1590632573160.1216212699; screenResolution=1920x1080; JSESSIONID.71a02d3e=node0781lhf8ypp6p1v6cave4zrfoc177028.node0","accept-language":"zh,zh-CN;q=0.9,en;q=0.8,en-US;q=0.7","accept-encoding":"gzip, deflate, br","referer":"https:\/\/jenkins-ci.youle.game\/static\/ad8559c0\/jsbundles\/base-styles-v2.css"},"method":"GET"},"client_ip":"172.16.142.25","tries":[{"balancer_latency":0,"port":8080,"balancer_start":1594968780402,"ip":"172.16.153.41"}],"upstream_uri":"\/static\/ad8559c0\/images\/top-sticker-bottom-edge.png","response":{"headers":{"content-type":"image\/png","date":"Fri, 17 Jul 2020 06:53:00 GMT","connection":"close","via":"kong\/2.0.5","cache-control":"public, max-age=31536000","content-length":"331","x-kong-proxy-latency":"0","last-modified":"Fri, 15 May 2020 07:06:23 GMT","x-kong-upstream-latency":"2","server":"Jetty(9.4.27.v20200227)","accept-ranges":"bytes","x-content-type-options":"nosniff"},"status":200,"size":"576"},"route":{"id":"fcb0c51d-ad32-4f7a-9422-e09c870d2a4f","path_handling":"v1","protocols":["https"],"service":{"id":"6d8467c2-8893-4c86-9b08-5020ffb1f97d"},"name":"jenkins-ci.youle.game","strip_path":true,"preserve_host":true,"regex_priority":0,"updated_at":1594806899,"hosts":["jenkins-ci.youle.game"],"https_redirect_status_code":426,"created_at":1594799339},"started_at":1594968780402}
{"latencies":{"request":3,"kong":1,"proxy":2},"service":{"host":"172.16.153.41","created_at":1594799287,"connect_timeout":60000,"id":"6d8467c2-8893-4c86-9b08-5020ffb1f97d","protocol":"http","name":"Jenkins","read_timeout":60000,"port":8080,"updated_at":1594799318,"tags":{},"write_timeout":60000,"retries":5},"request":{"querystring":{},"size":"40","uri":"\/static\/ad8559c0\/favicon.ico","url":"https:\/\/jenkins-ci.youle.game:8443\/static\/ad8559c0\/favicon.ico","headers":{"host":"jenkins-ci.youle.game","accept":"image\/webp,image\/apng,image\/*,*\/*;q=0.8","sec-fetch-site":"same-origin","sec-fetch-dest":"image","cache-control":"no-cache","sec-fetch-mode":"no-cors","pragma":"no-cache","user-agent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/84.0.4147.89 Safari\/537.36","cookie":"experimentation_subject_id=ImE4OGUwY2IxLWE4ZjEtNDc4OS05NzFlLTQ3ODZkY2RlZTYxZCI%3D--3c7624861dce5acfb4dc6f978fe1b3f7d1f49530; _ga=GA1.2.1173104791.1588061723; _fbp=fb.1.1590632573160.1216212699; screenResolution=1920x1080; JSESSIONID.71a02d3e=node0781lhf8ypp6p1v6cave4zrfoc177028.node0","accept-language":"zh,zh-CN;q=0.9,en;q=0.8,en-US;q=0.7","accept-encoding":"gzip, deflate, br","referer":"https:\/\/jenkins-ci.youle.game\/"},"method":"GET"},"client_ip":"172.16.142.25","tries":[{"balancer_latency":0,"port":8080,"balancer_start":1594968781191,"ip":"172.16.153.41"}],"upstream_uri":"\/static\/ad8559c0\/favicon.ico","response":{"headers":{"content-type":"image\/x-icon","date":"Fri, 17 Jul 2020 06:53:01 GMT","connection":"close","via":"kong\/2.0.5","cache-control":"public, max-age=31536000","content-length":"17542","x-kong-proxy-latency":"0","last-modified":"Fri, 15 May 2020 07:06:23 GMT","x-kong-upstream-latency":"2","server":"Jetty(9.4.27.v20200227)","accept-ranges":"bytes","x-content-type-options":"nosniff"},"status":200,"size":"17818"},"route":{"id":"fcb0c51d-ad32-4f7a-9422-e09c870d2a4f","path_handling":"v1","protocols":["https"],"service":{"id":"6d8467c2-8893-4c86-9b08-5020ffb1f97d"},"name":"jenkins-ci.youle.game","strip_path":true,"preserve_host":true,"regex_priority":0,"updated_at":1594806899,"hosts":["jenkins-ci.youle.game"],"https_redirect_status_code":426,"created_at":1594799339},"started_at":1594968781191}
```

#### 访问控制

通过插件设置访问的白名单和黑名单

![20211210183817](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183817.png)


#### 接口认证

当需要对特定的接口设置访问权限时，可以直接通过添加控制插件的方式，选择指定的授权方式

![20211210183831](https://raw.githubusercontent.com/Animezjy/PicGo_img/master/images20211210183831.png)