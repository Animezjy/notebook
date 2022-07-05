
阿里云OSS
```python
import oss2
WORKSPACE = os.getenv('WORKSPACE')
OSS_CONFIG = {  
    'bucket': 'pandora-packages',  
    'directory': 'tools',  
    'endpoint': 'oss-cn-beijing.aliyuncs.com',  
    'access_key_id': 'xxxxx',  
    'secret_access_key': 'xxxx'  
}

class AliCloudOSS(object):  
    def __init__(self, oss_config):  
    access_key_id = oss_config.get('access_key_id')  
    access_key_secret = oss_config.get('secret_access_key')  
    bucket_name = oss_config.get('bucket')  
    endpoint = oss_config.get('endpoint')  
    auth = oss2.Auth(access_key_id, access_key_secret)  
    self.bucket = oss2.Bucket(auth, endpoint, bucket_name)  
  
    self.directory = oss_config.get('directory')  
  
    @retry(stop_max_attempt_number=3, stop_max_delay=30000, wait_exponential_multiplier=5000)  
    def upload(self, file_path):  
    with open(file_path, 'rb') as f:  
    oss_file_path = os.path.join(self.directory, os.path.basename(file_path))  
    self.bucket.put_object(oss_file_path, f)  
  
    def generator_download_url(self, oss_path, filename):  
    oss_file_name = os.path.join(oss_path, filename)  
  
    sign_url = self.bucket.sign_url('GET', oss_file_name, 0)  
    url = sign_url.split('?')[0]  
    return url



@cli.command()  
def upload_oss():  
    oss = AliCloudOSS(OSS_CONFIG)  
    output = os.path.join(WORKSPACE, 'ci_output')  
    for file in os.listdir(output):  
    oss.upload(os.path.join(output, file))
```

腾讯云COS
```python
from retrying import retry
from qcloud_cos import CosConfig  
from qcloud_cos import CosS3Client 


class TXCos(object):

    def __init__(self, cos_config):
        self.access_key_id = cos_config.get('access_key_id')
        self.secret_access_key = cos_config.get('secret_access_key')
        self.region = cos_config.get('region')
        self.bucket = cos_config.get('bucket')
        self.directory = cos_config.get('directory')
        config = CosConfig(
            SecretId=self.access_key_id,
            SecretKey=self.secret_access_key,
            Region=self.region,
            Token=None,
            Scheme='https'
        )
        self.client = CosS3Client(config)

    @retry(stop_max_attempt_number=3, wait_incrementing_start=1000, wait_incrementing_increment=10000)
    def upload(self, file_path):
        filename = os.path.basename(file_path)
        return self.client.upload_file(
            Bucket=self.bucket,
            Key=os.path.join(self.directory, filename),
            LocalFilePath=file_path,
            PartSize=1,
            MAXThread=10
        )
```