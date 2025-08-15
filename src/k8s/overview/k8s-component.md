# k8s组件

k8s由各种组件构成。

![components-of-kubernetes](assets/components-of-kubernetes-1690504799889-3.svg)

具体组件如下：

### 控制平面组件（Control Plane Components）

控制平面组件会为集群做出全局决策，比如资源调度，以及响应集群时间，例如不满足副本（replicas）时，启动新的pod。

**控制平面组件可以在集群中的任何节点上运行**。但是为了简单起见，用一个node（一个计算机）专门运行，启动所有的控制平面。

**使用kubeadm可以跨多机器控制平面设置**



#### kube-apiserver（对外api）

​	该组件负责公开了 Kubernetes API，负责处理接受请求的工作。 API 服务器是 Kubernetes 控制平面的前端。

​	可以扩容apiserver，负载均衡流量

#### etcd（集群数据库）

​	一致且高可用的键值存储，用作 Kubernetes 所有集群数据的后台数据库。如果使用请做好备份计划

#### kube-scheduler（调度）

​	负责**监视**新创建的、未指定运行节点（node）的 Pods， 并选择节点来让 Pod 在上面运行。

#### kube-controller-manager（监控和控制）

​	k8s上的资源由该组件控制，该组件由多个控制器，分别控制不妥的资源。

​	从逻辑上讲， 每个控制器都是一个单独的进程， 但是为了降低复杂性，它们都被编译到同一个可执行文件，并在同一个进程中运行。

- 节点控制器（Node Controller）：负责在节点出现故障时进行通知和响应
- 任务控制器（Job Controller）：监测代表一次性任务的 Job 对象，然后创建 Pods 来运行这些任务直至完成
- 端点分片控制器（EndpointSlice controller）：填充端点分片（EndpointSlice）对象（以提供 Service 和 Pod 之间的链接）。
- 服务账号控制器（ServiceAccount controller）：为新的命名空间创建默认的服务账号（ServiceAccount）。

#### cloud-controller-manager

用于管理云提供商特定的资源和控制器，旨在将云提供商特定的功能从Kubernetes核心代码中分离出来，以便更好地支持多云环境。

如果要使用，则需要使用对应实现。

如：腾讯云提供了tencentcloud-cloud-controller-manager，阿里云提供了alicloud-cloud-controller-manager实现。

下面的控制器都包含对云平台驱动的依赖：

- 节点控制器（Node Controller）：用于在节点终止响应后检查云提供商以确定节点是否已被删除
- 路由控制器（Route Controller）：用于在底层云基础架构中设置路由
- 服务控制器（Service Controller）：用于创建、更新和删除云提供商负载均衡器

### Node

节点组件会在每个节点上运行，负责维护运行的 Pod 并提供 Kubernetes 运行环境。

通常情况下，一个主机对应一个Node，但一个Node可以运行多个Pod，从而实现资源共享和利用。

但是：一个主机和一个物理主机不是一一对应的，node可以跑到虚拟平台，云平台上。是一对多的关系

#### kubelet（确保pod在容器创建）

kubelet 接收一组通过各类机制提供给它的 PodSpecs， 确保这些 PodSpecs 中描述的容器处于运行状态且健康。 kubelet 不会管理不是由 Kubernetes 创建的容器。

#### kube-proxy（node的网络代理）

kube-proxy 维护节点上的一些网络规则， 这些网络规则会允许从集群内部或外部的网络会话与 Pod 进行网络通信。

如果操作系统设置了规则，否则该kube-proxy只做流量转发

#### 容器运行时（Container Runtime）容器操作软件

k8s支持许多运行，例如Docker， [CRI-O](https://cri-o.io/#what-is-cri-o) 

- **Minikube**: Use [CRI-O](https://minikube.sigs.k8s.io/docs/reference/runtimes/#cri-o) as the container runtime

  在安装 Minikube 时，可以使用 `--container-runtime` 选项来指定使用的容器运行时。如果不指定容器运行时，则默认使用 Docker。如果系统中没有安装 Docker，而且也没有指定其他容器运行时，则 Minikube 会自动安装 CRI-O。

- **kubeadm**：可以配置为CRI-O

### 插件（Addons）

插件使用 Kubernetes 资源DaemonSet、 Deployment 等）实现集群功能。 因为这些插件提供集群级别的功能，插件中命名空间域的资源属于 `kube-system` 命名空间。

#### DNS

集群 DNS 是一个 DNS 服务器，和环境中的其他 DNS 服务器一起工作，它为 Kubernetes 服务提供 DNS 记录。Kubernetes 启动的容器自动将此 DNS 服务器包含在其 DNS 搜索列表中。

#### Web 界面（仪表盘）

k8s可视化的管理端

#### 网络插件

给容器分配ip

