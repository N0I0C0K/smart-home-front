# Mqtt topic 设计

## 框架

- 板子
  - 传感器（温度、湿度等）
  - 受控器（灯光、舵机等）
- MQTT 服务器
- 终端控制器
  - 网页终端
  - 手机终端

## 名词规范

我们将上述的

- ”板子“ -> platform
- 板子上的传感器，受控器 -> node
- 终端控制器称为 -> center

## topic 设计

> **base**指的是每一个 topic 的共同前缀，我们用一个随机 6 位字符串作为 base 的值。

---

首先，几乎所有 topic 都是以下结构
base/[type]/[role]/[action]

**type**:

- listen
  - role 监听此 topic
- publish
  - role 在此 topic 发送

**role**

- center
  - 中心/控制中心
- sensor
  - 采集器/传感器/受控器

### center

center 对应所有传感器的控制监听终端，负责：

- 收听所有传感器的信息
- 控制所有受控器
- 监听 node 的存活情况

---

### node

node 是指每一个节点，每块板子上有多个 node

- 每个 node 的共有任务

  - 监听 center 的存活验证并返回存活消息

节点的类型有

- 传感器

  - bool 传感器（比如开关，只有开和关）
  - 数值传感器（比如温度，是一个数值在 1-1023 的区间内）

- 受控器
  - 受控器也是传感器（广义上）
  - bool 受控器，（比如开关）
  - 数值受控器（比如无极调灯，我们需要设置到一个范围）

传感器节点和受控器节点需要负责：

- 当数值变更时发布一次新的信息
- 监听 center 的主动请求数据并返回

---

## 消息类型

消息是指发生的 message，所有的消息我们使用‘|’作为参数分隔符

---

### 存活消息

存活消息由每个 node 发送，包含自身的信息
| 字段名称 | 作用 |
| --------- | --------------------- |
| nodeid | 节点 id(6 位随机字符) |
| node type | 节点类型\* |
| sub type| 子类型（暂时不考虑）|

注：节点类型：1:bool 传感器，2:数值传感器，11：bool 控制器，12:数值控制器，子类型：1.开关 2.温度 3.湿度

消息构造`nodeid|nodtype|node name|node position`
举例：`aacude|1`表示 node aacude 一个 bool 传感器存活

---

### 传感器上传数据

由 node 发布

| 字段名称    | 作用                 |
| ----------- | -------------------- |
| nodeid      | 节点 id              |
| value_raw   | 节点的传感器读取数据 |
| value_paser | 处理后的数据         |

`nodeid|node type|value_raw|value_paser`
举例：`aacude|2|246|23`

---

### 受控器控制消息

由 center 发布

| 字段名称 | 作用                     |
| -------- | ------------------------ |
| nodeid   | node id                  |
| value    | 设置到该数值，0-100 区间 |

举例`nodeid|value`

## topic 汇总

- cneter
  - base/publish/center/alive
  - base/listen/center/alive
- sensor

  - base/listen/sensor/nodeid
  - base/publish/sensor/nodeid

  - controller(如果是受控器)
    - base/control/nodeid

### alive

center 负责监听和发布

监听所有的存活消息，每当收到来自此 topic 的消息，执行以下步骤

1. 读取消息
2. 如果 nodeid 不存在列表里就添加否则更新

每隔一段时间 center 会发送一次检测存活

---

## 总结

### 板子需要订阅的 topic 有

- base/publish/center/alive
- base/listen/sensor/nodeid（每一个 nodeid 订阅一个）
- base/listen/controller/nodeid（每一个 nodeid 订阅一个）

### center 需要订阅的 topic 有

- base/listen/center/alive
- base/listen/center/sensor
- base/publish/sensor/nodeid

举例：

1. 首先 center 上线
2. center 发布检测 alive
3. 所有接收到的 node 全部响应
4. center 添加回应的节点
5. center 开始订阅
   1. 订阅 base/publish/sensor/# 通配符匹配所有节点
6. 如果需要单独更新某一个 node 传感器数据
   1. 发布 base/listen/sensor/nodeid 请求更新他的数据
   2. 接收到来自 base/publish/sensor/nodeid 的数据
   3. 更新 center 数据
7. 打开远程开关
   1. 发布 base/control/nodeid 消息：nodeid|1
   2. 监听来自 base/publish/sensor/nodeid 的消息，检测是否成功更新

## 可能出现的非正常情况

- alive 响应的节点数目小于 list 里面的数目
  - 将该节点标记为失去连接
- 发布请求更新无响应
  - 将该节点标记为失去连接
