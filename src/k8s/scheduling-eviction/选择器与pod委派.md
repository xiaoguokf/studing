# 将 Pod 指派给节点

我们可以约束pod，然后将pod放到指定的节点上。

## 节点标签

我们可以给节点加标签，然后就可以被查询和识别。

### 查询节点

```shell
kubectl get nodes
```

### 给节点加标签

```shell
 kubectl label nodes 节点名称 key=value   
```

例如：想给node01添加一个type=worker

```shell
kubectl label nodes node01 type=worker  
```

结果

```shell
controlplane $ kubectl label nodes node01 type=worker  
node/node01 labeled
```

### 查看所有标签

```shell
kubectl get nodes --show-labels
```

结果：type=worker成功添加

```shell
controlplane $ kubectl get nodes --show-labels
NAME           STATUS   ROLES           AGE   VERSION   LABELS
controlplane   Ready    control-plane   28d   v1.27.1   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=controlplane,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=,node.kubernetes.io/exclude-from-external-load-balancers=
node01         Ready    <none>          28d   v1.27.1   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node01,kubernetes.io/os=linux,type=worker
```

### 删除标签

```shell
kubectl label nodes 节点名称 key-  
```

例如：删除type

```shell
kubectl label nodes node01 type-
```

结果：

```shell
controlplane $ kubectl label nodes node01 type-
node/node01 unlabeled
```

### 通过标签查看节点

使用 -l 参数

```shell
controlplane $ kubectl get nodes -l kubernetes.io/hostname=node01
NAME     STATUS   ROLES    AGE   VERSION
node01   Ready    <none>   28d   v1.27.1
```



### 查询节点上的所有pod

因为node名字部署标签，所以使用字段选择器可以看到某个节点上分配的node

```shell
kubectl get pods --field-selector spec.nodeName=node01
```

### 查看所有pod所在节点

```shell
kubectl get pods --output=wide
```

现在，我们添加type=worker 开始我们实验pua



## nodeSelector

我们可以将pod轻松的放置到指定node，可以使用nodeSelector简单实现

该标签在pod模板中，在kind=pod应该也可以写吧

下面，我们使用该标签，将服务放到指定的集群上。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    app: nginx-dep
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image:  nginx:1.16.1
          ports:
            - containerPort: 80
      nodeSelector:
        type: worker
```



因为type=worker在node01上，查询node01上的节点

```shell
controlplane $ kubectl get pods --field-selector spec.nodeName=node01
NAME                    READY   STATUS    RESTARTS   AGE
nginx-c7656f7cd-4mrh9   1/1     Running   0          72s
nginx-c7656f7cd-9kgmf   1/1     Running   0          72s
nginx-c7656f7cd-flm9s   1/1     Running   0          72s
```

现在，我们做两种尝试：直接修改yaml，去掉nodeSelector字段，看看pod会不会重新调度

猜测：不会，因为pod仍然符合

结果：重新发生了调度，并且跟换了pod

```shell
controlplane $ kubectl get pods --field-selector spec.nodeName=node01
NAME                    READY   STATUS    RESTARTS   AGE
nginx-74b6b979f-lchtm   1/1     Running   0          28s
nginx-74b6b979f-w7vbd   1/1     Running   0          16s
```



## 亲和性与反亲和性

nodeSelector实现了简单的node标签匹配，我们想要实现复杂的匹配，我们可以采用亲和性。

亲和性和反亲和性的好处：

- 亲和性表达能力更强，表示对哪个节点更倾向，而nodeSelector只能指定标签
- 可以表明为软需求或者偏好，如果无法找到匹配项仍然调度该节点
- 你可以使用节点上（或其他拓扑域中）运行的其他Pod的标签来实施调度约束，而不是只能使用节点本身的标签，这样子可以进行Pod之间的约束。

### 节点亲和性

节点亲和性类似于nodeSelector，他使你可以根据节点上的标签来约束Pod可以调度在哪些节点上。

- `requiredDuringSchedulingIgnoredDuringExecution`： 调度器只有在规则被满足的时候才能执行调度。此功能类似于 `nodeSelector`， 但其语法表达能力更强。
- `preferredDuringSchedulingIgnoredDuringExecution`： 调度器会尝试寻找满足对应规则的节点。根据权重选择适合的节点，如果找不到匹配的节点，调度器仍然会调度该 Pod。

注：IgnoredDuringExecution后缀表示，如果在pod运行期间，node的label发生改变，pod仍然继续运行。然而nodeSelector会因为node标签发生改变而重新进行调度





例如下面的：Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: topology.kubernetes.io/zone
                    operator: In
                    values:
                      - antarctica-east1
                      - antarctica-west1
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 1
              preference:
                matchExpressions:
                  - key: type
                    operator: In
                    values:
                      - worker
```

此对象会选择地域为antarctica-east1，antarctica-west1的node，并且node的类型最好为worker节点 （type是自己打上去的）

#### requiredDuringSchedulingIgnoredDuringExecution

该属性下会有nodeSelectorTerms属性，它是一个matchExpressions数组

matchExpressions何selector中的matchExpressions差不多

可使用操作符： `In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt` 和 `Lt`

注：必须nodeSelectorTerms内的所有matchExpressions都匹配才能成功匹配

#### preferredDuringSchedulingIgnoredDuringExecution

该属性是一个数组，含有weight（权重）和preference（偏向）属性

进行node选择时，会对每个preferredDuringSchedulingIgnoredDuringExecution**成员** 进行匹配，若匹配成功，则加上权重。结果为得到全部权重和。最后按最大权重选择节点。



**注意：**

如果你同时指定了 `nodeSelector` 和 `nodeAffinity`，**两者** 必须都要满足， 才能将 Pod 调度到候选节点上。

如果你指定了多个与 `nodeAffinity` 类型关联的 `nodeSelectorTerms`， 只要其中一个 `nodeSelectorTerms` 满足的话，Pod 就可以被调度到节点上。

如果你指定了多个与同一 `nodeSelectorTerms` 关联的 `matchExpressions`， 则只有当所有 `matchExpressions` 都满足时 Pod 才可以被调度到节点上。

```yaml
nodeAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    nodeSelectorTerms:
    - matchExpressions:  # nodeSelectorTerm 1
      - key: disk-type
        operator: In
        values:
        - ssd
      - key: cpu-type
        operator: In
        values:
        - high-performance
    - matchExpressions:  # nodeSelectorTerm 2
      - key: gpu-type
        operator: In
        values:
        - nvidia
```

例如上面：nodeSelectorTerm 1和nodeSelectorTerm 2之间只要一个就可以了。而nodeSelectorTerm 1内的matchExpressions必须所有都满足。



#### 逐个调度方案（1.20+）

可以在**调度器配置**的 `args` 字段添加 `addedAffinity`实现pod的调度。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: foo-scheduler
    pluginConfig:
      - name: NodeAffinity
        args:
          addedAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
                - matchExpressions:
                    - key: scheduler-profile
                      operator: In
                      values:
                        - foo
```

然后在pod里指定调度器名字(待验证)

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      schedulerName: app
```



### Pod亲和性与反亲和性

Pod 间亲和性与反亲和性使你可以基于已经在节点上运行的 **Pod** 的标签来约束 Pod 可以调度到的节点，而不是基于节点上的标签。

**定义：**

​		“如果 X 上已经运行了一个或多个满足规则 Y 的 Pod， 则这个 Pod 应该（或者在反亲和性的情况下不应该）运行在 X 上”。 这里的 X 可以是节点、机架、云提供商可用区或地理区域或类似的拓扑域， Y 则是 Kubernetes 尝试满足的规则。



与[节点亲和性](#节点亲和性)类似，Pod 的亲和性与反亲和性也有两种类型：

- `requiredDuringSchedulingIgnoredDuringExecution`
- `preferredDuringSchedulingIgnoredDuringExecution`

区别：

- 节点只有亲和性，pod有亲和性和反亲和性，要使用 Pod 间亲和性，可以使用 Pod 规约中的 `.affinity.podAffinity` 字段。 对于 Pod 间反亲和性，可以使用 Pod 规约中的 `.affinity.podAntiAffinity` 字段。

与[节点亲和性](#节点亲和性)类似，Pod 的亲和性与反亲和性也有两种类型：

- `requiredDuringSchedulingIgnoredDuringExecution`
- `preferredDuringSchedulingIgnoredDuringExecution`



```yaml
apiVersion: v1
kind: Pod
metadata:
  name: with-pod-affinity
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: security
            operator: In
            values:
            - S1
        topologyKey: topology.kubernetes.io/zone
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: security
              operator: In
              values:
              - S2
          topologyKey: topology.kubernetes.io/zone
  containers:
  - name: with-pod-affinity
    image: registry.k8s.io/pause:2.0
```



**注**：topologyKey表示域选择标签，匹配规则会按域为一个整体来匹配。例如下面的对象，按zone匹配，如果一个zone中，至少需要有一个匹配，就可以调度到该zone上。如果一个zone中，存在security时，最好不要放在这个zone上



`topologyKey` 可以是**任何合法的标签键**。出于性能和安全原因，`topologyKey` 有一些限制：

- 对于 Pod 亲和性而言，在 `requiredDuringSchedulingIgnoredDuringExecution` 和 `preferredDuringSchedulingIgnoredDuringExecution` 中，`topologyKey` 不允许为空。

- 对于 `requiredDuringSchedulingIgnoredDuringExecution` 要求的 Pod 反亲和性， 准入控制器 `LimitPodHardAntiAffinityTopology` 要求 `topologyKey` 只能是 `kubernetes.io/hostname`。如果不想要这种控制可以禁用或者采用其他准入控制器。



#### 命名空间选择算符

用户可以使用亲和性规约中的`namespaceSelector`选择对应算符用来匹配特定的项目

```yaml
template:
  spec:
    affinity:
      podAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          - namespaceSelector:
              matchExpressions:
                - key: name
                  operator: In
                  values:
                    - nameValue
```

也有namespaces选定对应的亲和性

```yaml
template:
  spec:
    affinity:
      podAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
           - namespaces:
              - abbb
              - cddd
```







#### 例子

现在，我们需要一个3组服务，每个服务需要两个子（web-store，store），他们需要在不同节点上。



思路：将一个服务（store）使用pod反亲和性，分布在不同节点，如何另一个（web-store）使用pod亲和性靠近这个服务（store），反亲和性分布在不同的节点上。



```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: store-deploy
  labels:
    app: store-deploy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: store
  template:
    metadata:
      name: store
      labels:
        app: store
    spec:
      containers:
        - name: store
          image: redis
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - topologyKey: "kubernetes.io/hostname"
              labelSelector:
                matchLabels:
                  app: store
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-store-deploy
  labels:
    app: web-store-deploy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-store
  template:
    metadata:
      name: web-store
      labels:
        app: web-store
    spec:
      containers:
        - name: web-store
          image: nginx
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - topologyKey: "kubernetes.io/hostname"
              labelSelector:
                - matchLabels:
                    app: store
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - topologyKey: "kubernetes.io/hostname"
              labelSelector:
                matchLabels:
                  app: web-store
```



## nodeName

直接将pod指派给node，这样子更加直接，要考虑当前节点的稳定性问题

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  nodeName: kube-01
```





## Pod 拓扑分布约束

控制pod在 **区域（Region）、可用区（Zone）、节点和其他用户自定义的拓扑域**间的约束

使用该约束，可以实现高可用部署，保证数据的高可用行。

使用该部署不是可以实现弹性伸缩，我们可以使用k8s的来HPA实现弹性扩容



**Horizontal Pod Autoscaler (HPA)**：水平 Pod 自动伸缩器

**Cluster Autoscaler**：集群自动伸缩器

## 运算符总结


nodeAffinity` 和 `podAffinity可以使用In，NotIn，Exists，DoesNotExist

nodeAffinity可以增加使用Gt（小于），Lt（大于）

