
wget http://gosspublic.alicdn.com/ossfs/ossfs_1.80.6_centos7.0_x86_64.rpm
yum -y install ossfs_1.80.6_centos7.0_x86_64.rpm
echo pandora-logs:LTAINY7rq8iRq5X7:8BhpAMxS6ZkFfGpnnP6AsJCe7mtZmF > /etc/passwd-ossfs
chmod 640 /etc/passwd-ossfs
mkdir /mnt/ossfs
ossfs pandora-logs /mnt/ossfs -ourl=http://oss-cn-hangzhou-internal.aliyuncs.com -o allow_other
  



ossfs pandora-logs /mnt/ossfs -ourl=http://oss-cn-hangzhou-internal.aliyuncs.com -o allow_other