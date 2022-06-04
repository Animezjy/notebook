### Elasticsearch 概念简介

Elasticsearch是一个分布式的搜索引擎，我们常用于将其作为持久化日志存储的解决方案。

-   集群由一组Node组成
-   分布每个Node上方块是分片——shard
-   多个分片组合在一起叫做索引——index。索引的数据是分成若干部分，分布在不同的服务器节点中， 为了提供容灾能力，每一个分片都会有对应的副本数， 7.x版本中，一个索引默认有一个分片，每个分片有一个主分片和一个分片

![](https://cdn.nlark.com/yuque/0/2022/jpeg/219468/1653641540515-69f153e0-304c-4f23-8e0e-fbc484c86857.jpeg)

  

### 环境搭建

Elasticsearch

 docker run -dt -p 9200:9200 -p 9300:9300 \
            -e "discovery.type=single-node" \
            elasticsearch:7.17.4

  

Kibana

docker run -dt -p 5601:5601 \
           -e ELASTICSEARCH_URL=http://172.16.153.87:9200 \
           -e ELASTICSEARCH_HOSTS=http://172.16.153.87:9200 \
           kibana:7.17.4

### 基本概念

#### 索引

索引实际上是指向一个或者多个物理 分片 的逻辑命名空间

#### 索引模板

把已经创建好的某个索引的参数设置(settings)和索引映射(mapping)保存下来作为模板, 在创建新索引时, 指定要使用的模板名, 就可以直接重用已经定义好的模板中的设置和映射。

#### 冷热集群架构

集群的不同节点有明确的角色之分，冷热数据可以进行物理隔离，使SSD固态硬盘的使用效率提高

![](https://cdn.nlark.com/yuque/0/2022/png/219468/1653638808561-0664c9b2-4900-404c-bb17-e7a4eb02a95b.png)

-Enode.attr.data=hot
-Enode.attr.data=warm
-Enode.attr.data=cold

### 索引的声明周期管理

#### 为什么索引需要生命周期

1.  减少查询对象的数据量
2.  优化数据的存放位置
3.  优化硬件资源的使用效率

#### 生命周期策略ILM

![](https://cdn.nlark.com/yuque/0/2022/png/219468/1653625211173-bb876330-81ba-4419-a14b-e231973726ce.png)

  

##### 4个阶段

-   Hot：频繁的写入和查询
-   Warm：索引不在更新，仍然在查询
-   Cold：不再更新的索引，很少查询仍然可以搜索，查询较慢也没关系
-   Delete：不再需要的索引，可以安全的删除

##### 10个动作

-   allocate：将分片移动到具有不同性能特征的节点上，并减少副本的数量。
-   delete：永久移除索引。
-   force merge：减少索引段的数量并清除已删除的文档。使索引为只读。
-   freeze：冻结索引以最大程度减少其内存的占用量。
-   read only：阻止对索引的写操作。
-   rollover：删除索引作为过渡别名的写索引，然后开始索引到新索引。
-   set priority：降低索引在生命周期中的优先级，以确保首先恢复热索引。
-   shrink：通过将索引缩小为新索引来减少主分片的数量。
-   unfollow：将关注者索引转换为常规索引。在进行滚动或收缩操作之前自动执行。
-   wait for snapshot：删除索引之前，确保快照存在。

#### RollOver滚动索引

当索引满足一定条件之后，将不再写入数据，而是自动创建一个索引，所有的数据将写入新的索引。

以下3个条件任意满足触发：

-   文档数
-   时间
-   占用磁盘容量

#### 配置ILM

1.  通过Kibana页面或ES的API创建一个policy

2.  创建Index_template ，绑定policy，指定别名
3.  创建索引时使用该index template

#### IML策略示例

{
  "180-days-default" : {
    "version" : 1,
    "modified_date" : "2022-05-27T07:03:43.268Z",
    "policy" : {
      "phases" : {
        "warm" : {
          "min_age" : "2d",
          "actions" : {
            "shrink" : {
              "number_of_shards" : 1
            },
            "forcemerge" : {
              "max_num_segments" : 1
            }
          }
        },
        "cold" : {
          "min_age" : "30d",
          "actions" : { }
        },
        "hot" : {
          "min_age" : "0ms",
          "actions" : {
            "rollover" : {
              "max_primary_shard_size" : "50gb",
              "max_age" : "30d"
            }
          }
        },
        "delete" : {
          "min_age" : "180d",
          "actions" : {
            "delete" : {
              "delete_searchable_snapshot" : true
            }
          }
        }
      },
      "_meta" : {
        "managed" : true,
        "description" : "built-in ILM policy using the hot, warm, and cold phases with a retention of 180 days"
      }
    },
    "in_use_by" : {
      "indices" : [ ],
      "data_streams" : [ ],
      "composable_templates" : [ ]
    }
  }
}

### 万恶之源

[https://www.elastic.co/guide/en/beats/filebeat/current/ilm.html](https://www.elastic.co/guide/en/beats/filebeat/current/ilm.html)

setup.ilm.enabled: true