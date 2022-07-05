
拉取蓝鲸平台的资产，同步到consul中

```python
import json  
import logging  
import os  
import requests  
import datetime  
import hashlib  
  
import consul  
  
logging.basicConfig(level=logging.INFO)  
  
CONSUL_HOST = os.getenv('CONSUL_HOST', '127.0.0.1')  
CONSUL_PORT = os.getenv('CONSUL_PORT', 8500)  
CONSUL_SCHEMA = os.getenv('CONSUL_SCHEMA', 'http')  
  
NODE_EXPORTER_PORT = 9100  
  
PROJECT_INFO_MAPPING = {  
    "tkw": {  
    "exporter_url": "http://tkw-global-exporter.youle.game",  
    "target_path": "/prometheus/targets",  
    "global_module_name": "global"  
    },  
    "gouki": {  
    "exporter_url": "http://gouki-global-exporter.youle.game",  
    "target_path": "/prometheus/targets",  
    "global_module_name": "global"  
    },  
    "japari": {  
    "exporter_url": "http://japari-global-exporter.youle.game",  
    "target_path": "/prometheus/targets",  
    "global_module_name": "global"  
    },  
    "gbf": {  
    "exporter_url": "http://gbf-global-exporter.youle.game",  
    "target_path": "/prometheus/targets",  
    "global_module_name": "global"  
    },  
    "pandora": {  
    "exporter_url": "http://pandora-global-exporter.youle.game",  
    "target_path": "/prometheus/targets",  
    "global_module_name": "global"  
    },  
    "ace": {  
    "exporter_url": "http://ace-global-exporter.youle.game",  
    "target_path": "/prometheus/targets",  
    "global_module_name": "global"  
    }  
}  
  
  
class Consul(object):  
    def __init__(self, consul_host, consul_port):  
    self._consul = consul.Consul(consul_host, consul_port, scheme=CONSUL_SCHEMA)  
    self._services = {}  
  
    def register_service(self, name, service_id, host, port, tags=[]):  
    self._consul.agent.service.register(name, service_id, host, port, tags)  
    logging.info(f"Register service with id: {service_id} into {name}.")  
  
    def deregister_service(self, service_id):  
    logging.info(f"Deregister service with id: {service_id}")  
    return self._consul.agent.service.deregister(service_id)  
  
    @property  
    def services(self):  
    if not self._services:  
    services = self._consul.agent.services() or {}  
    for value in services.values():  
    self._services.setdefault(value.get("Service"), {}).setdefault("targets", {})[  
    value.get("ID")] = value["Tags"]  
  
    return self._services  
  
    def get_service_by_name(self, name):  
    services = self.services.get(name, {})  
    services["scanned"] = True  
    return services  
  
  
class ServiceClient(object):  
  
    def __init__(self):  
    self.key = "monitor"  
    self.secret = "d7bd22379890c4ed3a2815c62493f036"  
    self.url = "https://cmdb-agent.topjoy.com/service.json"  
  
    def _get_data(self, **params):  
    """  
    :param params:    :return:  
    """  
    data = params.get('json_str', '')  
    headers = {  
    'content-type': 'application/json-rpc',  
    'type': 'application/json-rpc',  
    'Date': self._atom_time()  
  
    }  
    json_dict = json.loads(data, strict=False)  
    token = self._get_token(  
    params=json_dict['params'],  
    now=headers['Date']  
    )  
    headers['Authorization'] = 'SERVICE %s:%s' % (self.key, token)  
    try:  
    r = requests.post(self.url, data=data, headers=headers, timeout=30)  
    logging.info(  
    f"ServiceClient.get_data Parameter URL: {self.url}, Data: {data}, Headers: {headers}, Response: {r.text}, StatusCode: {r.status_code}")  
    return json.loads(r.text)  
    except Exception as e:  
    logging.error("ServiceClient.get_data with error: {}.".format(e.message))  
  
    def _get_token(self, **params):  
    """  
    :param params:    :return:  
    """  
    param_data = params.get('params', {})  
    now = params.get('now', '')  
    params_sorted = sorted(param_data.items(), key=lambda a: a[0])  
    params_str = self._convert_dict_to_str(params=params_sorted)  
    s = params_str + self.secret + now  
    md5 = hashlib.md5()  
    md5.update(s.encode("utf-8"))  
    md5_str = md5.hexdigest()  
    return md5_str  
  
    def _atom_time(self):  
    """  
    :return:  
    """  
    now = datetime.datetime.now()  
  
    return now.strftime('%Y-%m-%dT%H:%M:%S+08:00')  
  
    def _convert_dict_to_str(self, **params):  
    """  
    :param params:    :return:  
    """  
    glue = params.get('glue', '')  
    param_data = params.get('params', [])  
    str_data = ''  
    if param_data:  
    for k, v in param_data:  
    if type(v) == tuple or type(v) == list:  
    v = sorted(v)  
    tmp_str = glue.join(v)  
    str_data += k + tmp_str + glue  
    else:  
    str_data += k + v + glue  
    return str_data  
  
    def _get_json_str(self, method, params):  
    json_str = json.dumps({  
    "jsonrpc": "2.0",  
    "id": "1",  
    "method": method,  
    "params": params  
    })  
    return json_str  
  
    def request_cmdb(self, method, params):  
    json_str = self._get_json_str(method, params)  
    data = self._get_data(json_str=json_str)  
    return data["result"]  
  
  
class Cmdb(object):  
  
    def __init__(self):  
    self.service_client = ServiceClient()  
  
    def get_projects(self):  
    method = "getCategories"  
    params = {  
    "status": ["0", "1", "2"],  
    "fields": ["id", "name", "prefix"]  
    }  
    data = self.service_client.request_cmdb(method, params)  
    return data  
  
    def get_domain_by_cluster_id(self, cluster_id, game_mod):  
    method = "getDomain"  
    params = {  
    "cluster_id": cluster_id,  
    "game_mod": game_mod  
    }  
    data = self.service_client.request_cmdb(method, params)  
  
    if data:  
    return data[0]["domain"]  
    else:  
    return ""  
  
    def get_cluster_aes(self, cluster_id, game_mod):  
    method = 'getAesEncryption'  
    params = {  
    "cluster_id": str(cluster_id),  
    "game_mod": game_mod  
    }  
    data = self.service_client.request_cmdb(method, params)  
  
    if data:  
    return data[0].get("aes_key"), data[0].get("aes_iv")  
    else:  
    return "", ""  
  
    def get_cluster_by_project_id(self, project_id):  
    method = "getClusters"  
    params = {  
    "main_category_id": project_id,  
    "status": ["1", "0"],  
    "fields": ["name", "main_category_id", "id", "prefix", "is_monitor"]  
    }  
    data = self.service_client.request_cmdb(method, params)  
    return data  
  
    def get_server_by_project_id(self, main_category_id):  
    method = "getAssets"  
    params = {  
    "main_category_id": main_category_id,  
    }  
  
    data = self.service_client.request_cmdb(method, params)  
  
    server_info = [{  
    "cluster_name": server["cluster_name"],  
    "is_manage": server["is_manage"],  
    "hostname": server["hostname"],  
    "public_ip": server["public_ip"],  
    "inner_ip": server["inner_ip"],  
    "module_list": server.get("module_list", [])}  
    for server in data  
    if server["is_manage"] == '1'  
    ]  
  
    return server_info  
  
    def get_server_by_cluster_id(self, main_category_id, cluster_id):  
    method = "getAssets"  
    params = {  
    "main_category_id": main_category_id,  
    "cluster_id": cluster_id,  
  
    }  
  
    data = self.service_client.request_cmdb(method, params)  
  
    server_info = [{  
    "cluster_name": server["cluster_name"],  
    "is_manage": server["is_manage"],  
    "hostname": server["hostname"],  
    "public_ip": server["public_ip"],  
    "inner_ip": server["inner_ip"]}  
    for server in data  
    if server["is_manage"] == '1'  
    ]  
  
    return server_info  
  
  
class TargetOperator(object):  
  
    def __init__(self, project_name, project_id):  
    self.project_name = project_name  
    self.project_id = project_id  
    self._aes_info = {}  
    self.cmdb = Cmdb()  
  
    def global_url(self, cluster_id):  
    global_url = self.cmdb.get_domain_by_cluster_id(cluster_id,  
    PROJECT_INFO_MAPPING[self.project_name]['global_module_name'])  
    return global_url  
  
    def aes_info(self, cluster_id):  
    if not self._aes_info.get(cluster_id):  
    self._aes_info[cluster_id] = self.cmdb.get_cluster_aes(cluster_id, "vms")  
    return self._aes_info[cluster_id]  
  
    def aes_key(self, cluster_id):  
    return self.aes_info(cluster_id)[0]  
  
    def aes_iv(self, cluster_id):  
    return self.aes_info(cluster_id)[1]  
  
    def target_format(self, targets, aes_key, aes_iv, global_url):  
    for target in targets:  
    target["labels"].update({  
    "key": aes_key,  
    "iv": aes_iv,  
    "globalUrl": global_url  
    })  
  
    return targets  
  
    def default(self):  
    return []  
  
    def hosts(self):  
    hosts = self.cmdb.get_server_by_project_id(self.project_id)  
  
    hosts_info = [  
    {  
    "targets": [f"{host.get('inner_ip')}:{NODE_EXPORTER_PORT}"],  
    "labels": {  
    "project": self.project_name,  
    "cluster": host.get("cluster_name"),  
    "inner_ip": host.get("inner_ip"),  
    "public_ip": host.get("public_ip"),  
    "hostname": host.get("hostname"),  
    "module": ",".join(sorted(host.get("module_list")))  
    }  
    } for host in hosts]  
    return hosts_info  
  
    def tkw_targets(self, cluster_id):  
    target_path = PROJECT_INFO_MAPPING[self.project_name]['target_path']  
    exporter_url = PROJECT_INFO_MAPPING[self.project_name]['exporter_url']  
    aes_iv = self.aes_iv(cluster_id)  
    aes_key = self.aes_key(cluster_id)  
    global_url = self.global_url(cluster_id)  
    if not global_url:  
    return None  
  
    if aes_key and aes_iv:  
    targets_url = f"{exporter_url}{target_path}?iv={aes_iv}&key={aes_key}&globalUrl={global_url}"  
    else:  
    targets_url = f"{exporter_url}{target_path}?globalUrl={global_url}"  
  
    try:  
    resp = requests.get(targets_url, timeout=5)  
    except (requests.exceptions.ConnectionError, requests.exceptions.ReadTimeout) as e:  
    logging.error('Connection timeout, please check targets_ url:{}'.format(targets_url))  
    else:  
    try:  
    resp_data = resp.json()  
    return self.target_format(resp_data, aes_key, aes_iv, global_url)  
    except json.decoder.JSONDecodeError as e:  
    logging.error('Response can not be Json Decode,targets_url is :{}'.format(targets_url))  
  
    def gouki_targets(self, cluster_id):  
    target_path = PROJECT_INFO_MAPPING[self.project_name]['target_path']  
    exporter_url = PROJECT_INFO_MAPPING[self.project_name]['exporter_url']  
    aes_iv = self.aes_iv(cluster_id)  
    aes_key = self.aes_key(cluster_id)  
    global_url = self.global_url(cluster_id)  
    if not global_url:  
    logging.error("Can find global url, Please check whether it is configured Global URL.")  
    return None  
    if aes_key and aes_iv:  
    targets_url = f"{exporter_url}{target_path}?iv={aes_iv}&key={aes_key}&globalUrl={global_url}"  
    else:  
    targets_url = f"{exporter_url}{target_path}?globalUrl={global_url}"  
  
    try:  
    resp = requests.get(targets_url, timeout=5)  
    except (requests.exceptions.ConnectionError, requests.exceptions.ReadTimeout) as e:  
    logging.error('Connection timeout, please check targets_ url:{}'.format(targets_url))  
    else:  
    try:  
    resp_data = resp.json()  
    for target in resp_data:  
    new_target = [':'.join(v.split(":")[1::]) for v in target.get("targets")]  
    target["targets"] = new_target  
    return self.target_format(resp_data, aes_key, aes_iv, global_url)  
    except json.decoder.JSONDecodeError as e:  
    logging.error('Response can not be Json Decode,targets_url is :{}'.format(targets_url))  
  
    def japari_targets(self, cluster_id):  
    target_path = PROJECT_INFO_MAPPING[self.project_name]['target_path']  
    exporter_url = PROJECT_INFO_MAPPING[self.project_name]['exporter_url']  
    aes_iv = self.aes_iv(cluster_id)  
    aes_key = self.aes_key(cluster_id)  
    global_url = self.global_url(cluster_id)  
    if not global_url:  
    return None  
  
    if aes_key and aes_iv:  
    targets_url = f"{exporter_url}{target_path}?iv={aes_iv}&key={aes_key}&globalUrl={global_url}"  
    else:  
    targets_url = f"{exporter_url}{target_path}?globalUrl={global_url}"  
  
    try:  
    resp = requests.get(targets_url, timeout=5)  
    except (requests.exceptions.ConnectionError, requests.exceptions.ReadTimeout) as e:  
    logging.error('Connection timeout, please check targets_ url:{}'.format(targets_url))  
    else:  
    if resp.status_code == 200:  
    try:  
    resp_data = resp.json()  
    return self.target_format(resp_data, aes_key, aes_iv, global_url)  
    except json.decoder.JSONDecodeError as e:  
    logging.error('Response can not be Json Decode,targets_url is :{}'.format(targets_url))  
    else:  
    logging.warning('Response code isn\'t 200,targets_url is :{}'.format(targets_url))  
  
    def gbf_targets(self, cluster_id):  
    target_path = PROJECT_INFO_MAPPING[self.project_name]['target_path']  
    exporter_url = PROJECT_INFO_MAPPING[self.project_name]['exporter_url']  
    aes_iv = self.aes_iv(cluster_id)  
    aes_key = self.aes_key(cluster_id)  
    global_url = self.global_url(cluster_id)  
    if not global_url:  
    return None  
  
    if aes_key and aes_iv:  
    targets_url = f"{exporter_url}{target_path}?iv={aes_iv}&key={aes_key}&globalUrl={global_url}"  
    else:  
    targets_url = f"{exporter_url}{target_path}?globalUrl={global_url}"  
  
    try:  
    resp = requests.get(targets_url, timeout=5)  
    except (requests.exceptions.ConnectionError, requests.exceptions.ReadTimeout) as e:  
    logging.error('Connection timeout, please check targets_ url:{}'.format(targets_url))  
    else:  
    try:  
    resp_data = resp.json()  
    except json.decoder.JSONDecodeError as e:  
    logging.error('Response can not be Json Decode,targets_url is :{}'.format(targets_url))  
    else:  
    if isinstance(resp_data, list):  
    return self.target_format(resp_data, aes_key, aes_iv, global_url)  
  
    def pandora_targets(self, cluster_id):  
    target_path = PROJECT_INFO_MAPPING[self.project_name]['target_path']  
    exporter_url = PROJECT_INFO_MAPPING[self.project_name]['exporter_url']  
    aes_info = {}  
    if not self._aes_info.get(cluster_id):  
    aes_info[cluster_id] = self.cmdb.get_cluster_aes(cluster_id, "global")  
    aes_key = aes_info.get(cluster_id)[0]  
    aes_iv = aes_info.get(cluster_id)[1]  
    global_url = self.global_url(cluster_id)  
    if not global_url:  
    return None  
  
    if aes_key and aes_iv:  
    targets_url = f"{exporter_url}{target_path}?iv={aes_iv}&key={aes_key}&globalUrl={global_url}"  
    else:  
    targets_url = f"{exporter_url}{target_path}?globalUrl={global_url}"  
  
    try:  
    resp = requests.get(targets_url, timeout=5)  
    except (requests.exceptions.ConnectionError, requests.exceptions.ReadTimeout) as e:  
    logging.error('Connection timeout, please check targets_ url:{}'.format(targets_url))  
    else:  
    try:  
    resp_data = resp.json()  
    except json.decoder.JSONDecodeError as e:  
    logging.error('Response can not be Json Decode,targets_url is :{}'.format(targets_url))  
    else:  
    if isinstance(resp_data, list):  
    return self.target_format(resp_data, aes_key, aes_iv, global_url)  
  
    def ace_targets(self, cluster_id):  
    target_path = PROJECT_INFO_MAPPING[self.project_name]['target_path']  
    exporter_url = PROJECT_INFO_MAPPING[self.project_name]['exporter_url']  
    aes_iv = self.aes_iv(cluster_id)  
    aes_key = self.aes_key(cluster_id)  
    global_url = self.global_url(cluster_id)  
    if not global_url:  
    return None  
  
    if aes_key and aes_iv:  
    targets_url = f"{exporter_url}{target_path}?iv={aes_iv}&key={aes_key}&globalUrl={global_url}"  
    else:  
    targets_url = f"{exporter_url}{target_path}?globalUrl={global_url}"  
  
    try:  
    resp = requests.get(targets_url, timeout=5)  
    except (requests.exceptions.ConnectionError, requests.exceptions.ReadTimeout) as e:  
    logging.error('Connection timeout, please check targets_ url:{}'.format(targets_url))  
    else:  
    try:  
    resp_data = resp.json()  
    except json.decoder.JSONDecodeError as e:  
    logging.error('Response can not be Json Decode,targets_url is :{}'.format(targets_url))  
    else:  
    if isinstance(resp_data, list):  
    return self.target_format(resp_data, aes_key, aes_iv, global_url)  
  
  
def update_consul_service(consul_client, targets, service_type):  
    targets_all = set()  
    consul_service_all = []  
    for target in targets:  
    instance_type = target.get("labels")["module"] if service_type == "services" else "hosts"  
    project = target.get("labels")["project"]  
    cluster = target.get("labels")["cluster"]  
    service_name = "{}_{}_{}".format(project, cluster, service_type)  
    tags = [f"{key}={value}" for key, value in target.get("labels").items() if value]  
    consul_service_li = consul_client.get_service_by_name(service_name)  
    consul_service_all.extend(consul_service_li.get("targets", []))  
  
    for instance in target.get("targets"):  
    service_id = f"{project}_{cluster}_{instance_type}_{instance}"  
    targets_all.add(service_id)  
    host, port = instance.split(":")  
    if sorted(consul_service_li.get("targets", {}).get(service_id, [])) != sorted(tags):  
    consul_client.register_service(service_name, f"{service_id}", host, int(port), tags=tags)  
  
    for instance_id in consul_service_all:  
    if instance_id in targets_all:  
    continue  
    else:  
    consul_client.deregister_service(instance_id)  
  
  
def unregister_all(consul_host, consul_port):  
    consul_client = Consul(consul_host, consul_port)  
  
    for service in consul_client.get_service():  
    consul_client.deregister_service(service)  
  
  
def main(consul_host, consul_port):  
    consul_client = Consul(consul_host, consul_port)  
    cmdb = Cmdb()  
    projects = cmdb.get_projects()  
  
    clean_white_list = []  
  
    for project in projects:  
    project_name = project.get("prefix")  
  
    op = TargetOperator(project.get("prefix"), project.get("id"))  
    hosts = op.hosts()  
    if hosts:  
    update_consul_service(consul_client, hosts, "hosts")  
  
    clusters = cmdb.get_cluster_by_project_id(project.get("id"))  
    for cluster in clusters:  
    cluster_id = cluster.get("id")  
    cluster_name = cluster.get("name")  
    if not (project.get("prefix") in PROJECT_INFO_MAPPING and cluster.get("is_monitor") == "1"):  
    continue  
  
    if hasattr(op, f"{project_name}_targets"):  
    targets = getattr(op, f"{project_name}_targets")(cluster_id)  
    if not targets:  
    logging.info(  
    f"There is no information in cluster '{cluster_name}' and module 'vms' under project '{project_name}'")  
    else:  
    targets = getattr(op, "default")()  
  
    if targets:  
    update_consul_service(consul_client, targets, "services")  
    else:  
    service_name = "{}_{}_{}".format(project_name, cluster_name, "services")  
    clean_white_list.append(service_name)  
  
    logging.info(  
    f"Can not get service targets with name {service_name}, add this service into clean white list.")  
  
    for service_name, service_info in consul_client.services.items():  
    if not service_info.get("scanned") and service_name not in clean_white_list:  
    for target in service_info.get("targets", []):  
    consul_client.deregister_service(target)  
  
  
if __name__ == '__main__':  
    main(CONSUL_HOST, int(CONSUL_PORT))
```