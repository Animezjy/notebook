
Pod是Kubernetes集群(以下简称k8s集群)中的最小调度单元。在k8s集群中一个pod的完整定义yaml内容如下
```yaml
apiVersion: v1
items:
- apiVersion: v1
  kind: Pod
  metadata:
    labels:
      app: echoserver
    name: echoserver-6f6d9d5f47-qmwkb
    namespace: default
    ownerReferences:
    - apiVersion: apps/v1
      blockOwnerDeletion: true
      controller: true
      kind: ReplicaSet
      name: echoserver-6f6d9d5f47
  spec:
    containers:
    - env:
      - name: NODE_NAME
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: spec.nodeName
      - name: POD_NAME
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: POD_NAMESPACE
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: POD_IP
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      image: ssgeek/echoserver:latest
      imagePullPolicy: Always
      name: echoserver
      ports:
      - containerPort: 8080
        protocol: TCP
      resources: {}
      terminationMessagePath: /dev/termination-log
      terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
        name: default-token-ztv8f
        readOnly: true
    dnsPolicy: ClusterFirst
    enableServiceLinks: true
    nodeName: 172.16.149.203
    preemptionPolicy: PreemptLowerPriority
    priority: 0
    restartPolicy: Always
    schedulerName: default-scheduler
    securityContext: {}
    serviceAccount: default
    serviceAccountName: default
    terminationGracePeriodSeconds: 30
    tolerations:
    - effect: NoExecute
      key: node.kubernetes.io/not-ready
      operator: Exists
      tolerationSeconds: 300
    - effect: NoExecute
      key: node.kubernetes.io/unreachable
      operator: Exists
      tolerationSeconds: 300
    volumes:
    - name: default-token-ztv8f
      secret:
        defaultMode: 420
        secretName: default-token-ztv8f
  status:
    conditions:
    - lastProbeTime: null
      lastTransitionTime: "2021-06-29T03:26:56Z"
      status: "True"
      type: Initialized
    - lastProbeTime: null
      lastTransitionTime: "2021-06-29T03:28:05Z"
      status: "True"
      type: Ready
    - lastProbeTime: null
      lastTransitionTime: "2021-06-29T03:28:05Z"
      status: "True"
      type: ContainersReady
    - lastProbeTime: null
      lastTransitionTime: "2021-06-29T03:26:55Z"
      status: "True"
      type: PodScheduled
    containerStatuses:
    - containerID: docker://9096611ce67a0eb8797b4fce7b34182694dfdba6566bac9168140bc8883c3659
      image: ssgeek/echoserver:latest
      imageID: docker-pullable://ssgeek/echoserver@sha256:4c7ebead766937106182bd29a89f551b2243b0ecd7eaaf4e39c5c56f76166905
      lastState: {}
      name: echoserver
      ready: true
      restartCount: 0
      started: true
      state:
        running:
          startedAt: "2021-06-29T03:28:04Z"
    hostIP: 172.16.149.203
    phase: Running
    podIP: 10.42.2.163
    podIPs:
    - ip: 10.42.2.163
    qosClass: BestEffort
    startTime: "2021-06-29T03:26:56Z"
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```
!> 刚接触k8s时，看着这些大量的配置，一时间确实难以消化，在后面的逐步学习中，会渐渐的接触到其中的一些字段，用的多了就熟悉了


对于其中比较重要的字段做出说明
|字段|解释|是否必填|
|--|--|--|--|
|spec|