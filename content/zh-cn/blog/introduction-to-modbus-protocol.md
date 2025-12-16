---
title: "Modbus协议介绍"
date: 2023-07-24
author: "天/天 XS"
description: "Modbus协议由Modicon公司于1979年开发，最初用于其可编程逻辑控制器（PLC）的通讯。随着时间推移，它因免费开放和易于实现而成为工业标准。"
categories: ["Content"]
tags: ["modbus", "content-management", "organization", "workflow"]
featured_image: "/images/blog/modbus-001.png"
---

{{< toc >}}

在工业自动化领域，Modbus绝对是个绕不开的名字。作为一个从上世纪70年代末就诞生的通信协议，历久弥坚，默默支撑着无数工厂和设备的互联互通。今天咱们就来聊聊Modbus这个工业通信的元老级协议。

---

## Modbus的历史发展

1979年，Modicon公司（也就是现在的施耐德电气前身）推出了一款专为可编程逻辑控制器（[PLC](https://zhida.zhihu.com/search?content_id=259799099&content_type=Article&match_order=1&q=PLC&zhida_source=entity)）设计的通信协议，这就是Modbus。当时的工业现场，设备之间的通信还停留在电压或电流信号的原始阶段，比如用高低电平表示开关状态，或者用0-10V、4-20mA来传递模拟量数据。Modbus的出现，就像给这些设备装上了翻译器，让PLC和现场设备能更高效地对话。

![](https://pica.zhimg.com/v2-409dd9793660c250081028fed8ab50a8_1440w.jpg)

Modbus协议发展时间线

Modbus是[现场总线](https://zhida.zhihu.com/search?content_id=259799099&content_type=Article&match_order=1&q=%E7%8E%B0%E5%9C%BA%E6%80%BB%E7%BA%BF&zhida_source=entity)（Fieldbus）协议的鼻祖。现场总线是什么？简单来说，它就是工业网络的通信方式，能让多个设备通过一对线缆连接到控制器，省去了点对点接线的麻烦。过去每加一个传感器就得拉一根线，布线成本和复杂度跟蜘蛛网似的，而现场总线就有点像WiFi，把设备们都连到一个网络里，省时省力。

除了Modbus，工业领域还有[Profibus](https://zhida.zhihu.com/search?content_id=259799099&content_type=Article&match_order=1&q=Profibus&zhida_source=entity)、[DeviceNet](https://zhida.zhihu.com/search?content_id=259799099&content_type=Article&match_order=1&q=DeviceNet&zhida_source=entity)、ControlNet等一堆现场总线协议，但Modbus凭着简单易用、开源免费的特点，成了最普及的工业协议之一，至今在全球工厂里依然随处可见。

---

## Modbus设计

![](https://pic4.zhimg.com/v2-db3a72072776678ac0de161b684af611_1440w.jpg)

Modbus主从通信模型

Modbus的设计初衷是让PLC和现场设备顺畅交流。最初它跑在串口通信上，比如RS-232或RS-485，速度慢但够稳定。后来随着网络技术发展，Modbus也升级成了支持TCP/IP和以太网的Modbus TCP，适应了现代工业网络的需求。

Modbus 的核心是个 **主从通信模型**：一个主设备（Master）发号施令，多个从设备（Slave）老老实实响应。主设备可以是 PLC、SCADA 系统或者一台工控机，从设备可能是传感器、变频器或者其他智能仪表。主设备主动发起请求，比如读取数据或发送控制命令，从设备根据请求返回数据或执行操作，整个过程清晰明了。

![](https://pic2.zhimg.com/v2-40212528bd7f3bac19ecee187fb0da29_1440w.jpg)

Modbus数据类型

数据方面，Modbus 支持两种基本格式：

- **离散量**：也就是单个 bit，表示开关状态，比如 0/1、真/假。
- **寄存器**：16 位字，通常存数值，比如温度、压力，或者其他需要表达的复杂数据。

这种简单的数据组织方式，让 Modbus 既能应对简单的开关控制，也能处理复杂的数值传输，适应性极强。

---

## Modbus数据传输

Modbus 的数据传输有自己的套路，了解这些细节对调试和排错至关重要。拿最基础的位传输来说，Modbus 按 **先低位后高位** 的顺序发送比特（LSB to MSB）。比如有个字节是 11010010，实际传输时会拆成单个比特，按 0、1、0、0、1、0、1、1 的顺序依次发送。

![](https://pic1.zhimg.com/v2-eb522fa7214fff037912cca1f0d484f8_1440w.jpg)

位传输顺序 (LSB to MSB)

为什么要这么讲究？因为接收端得按同样的规则解码，才能确保数据不乱套。这就像调试串口时得先确认波特率、奇偶校验和停止位一样，Modbus 的位序就是类似的基础约定。

至于字节传输，Modbus 根据具体实现方式（RTU、ASCII 或 TCP）会有不同处理，待会我们会细聊。

---

## 地址和功能码

Modbus 的通信离不开 `地址` 和 `功能码`，这两者就像指挥系统的大脑和指令集。

### 设备地址

每个从设备都有一个独一无二的地址，通常从 1 到 247。主设备发送请求时，会在消息中带上目标从设备的地址，确保命令发到正确的设备。这就像你用快递寄包裹，得写清楚收件人地址，不然包裹可就送错地方了。

### 寄存器地址

![](https://pic3.zhimg.com/v2-37111d9496be96f409e2322e300796b2_1440w.jpg)

Modbus寄存器地址映射

Modbus 里的数据按类型存放在不同寄存器里，常见的有：

- **线圈（Coils）**：从 00001 开始，存开关量，读写都行。
- **离散输入（Discrete Inputs）**：从 10001 开始，存只读的开关量。
- **输入寄存器（Input Registers）**：从 30001 开始，存只读的数值。
- **保持寄存器（Holding Registers）**：从 40001 开始，存可读写的数值。

通过指定寄存器地址，主设备就能精准地读写目标数据。比如，想读取某个温度传感器的值，可能就要访问 30001 号输入寄存器。

### 功能码

功能码告诉从设备该做什么。

![](https://pica.zhimg.com/v2-b9c07f1160719caf91a6312b92d6b6ce_1440w.jpg)

常用功能码

主设备发送的消息帧里会包含设备地址、功能码和寄存器地址，从设备收到后根据功能码执行相应操作。这就像嵌入式开发中，单片机收到上位机的指令后，解析命令字然后执行对应动作。

---

## Modbus 的三种实现

![](https://pica.zhimg.com/v2-44d380afd406a70225bab7b9270c644e_1440w.jpg)

![](https://pic4.zhimg.com/v2-ba5f795ceab70e24ff615c16c14590a3_1440w.jpg)

Modbus三种实现方式对比

Modbus 有三种主要实现方式：RTU、ASCII 和 TCP，每种都有自己的特点和适用场景。

### Modbus RTU

![](https://pic4.zhimg.com/v2-abec9e82213d7e00edbd7e62406483b7_1440w.jpg)

Modbus RTU 消息帧结构

RTU（Remote Terminal Unit）是 Modbus 的经典实现，特别适合串口通信，比如 RS-232 或 RS-485。RS-485 尤其常见，因为它支持长距离传输（上千米）和多点通信，抗干扰能力也强，非常适合工厂里设备分散的场景。

RTU 用二进制编码，消息帧紧凑，包含设备地址、功能码、数据和 CRC 校验。效率高、速度快，但对时序要求严格，调试时得格外注意波特率和帧间间隔。

### Modbus ASCII

![](https://pic2.zhimg.com/v2-3fa7a693c0f184c9fbeac9e0275dbbd7_1440w.jpg)

Modbus ASCII 消息帧结构

ASCII 模式用可读的 ASCII 字符（0-9、A-F）表示数据，每个字节拆成两个字符发送。比如二进制数据 0xAB 会变成 ASCII 的 41 42。消息帧以冒号（:）开头，回车换行结尾，适合需要人眼调试的场景。

但 ASCII 模式消息长、传输慢，效率远不如 RTU，实际工业现场用得少，多见于一些老旧设备或者教学场景。

### Modbus TCP：拥抱以太网

![](https://pic1.zhimg.com/v2-2d660bf6dfe374082e5e6f1e6ade2b00_1440w.jpg)

Modbus TCP 协议栈

TCP 模式是 Modbus 的以太网版本，基于 TCP/IP 协议，跑在标准以太网 infrastructure 上。相比串口，TCP 速度快、距离远，还能轻松接入企业网络，特别适合现代化的 SCADA 系统或远程监控。

![](https://pic4.zhimg.com/v2-f4837016f8087aa5b00547c37db1a54d_1440w.jpg)

Modbus TCP MBAP头部结构

TCP 消息帧去掉了 CRC 校验（因为 TCP 协议自带可靠性保证），增加了 MBAP 头（Modbus Application Protocol Header），包含事务标识、协议标识等字段。很多新能源项目，比如光伏电站的逆变器监控，就喜欢用 Modbus TCP，方便和云端系统对接。

## Modbus为什么能成功

Modbus的成功离不开它的简单和开放。协议设计直白，学习曲线低，工程师随便翻翻文档就能上手实现。它的开源免费属性也让厂商无需支付授权费，降低了成本。很多中小型工厂，设备老旧，预算有限，但是借助Modbus，串口转TCP的网关一接，老设备也能接入现代网络。

![](https://pic2.zhimg.com/v2-7297c4d5d20b4615c8726bfe4b5d53af_1440w.jpg)

RS-485 总线拓扑

![](https://pic2.zhimg.com/v2-8a590dfff65282996d66491abdc04b49_1440w.jpg)

Modbus TCP 网络拓扑

当然，Modbus也有短板，比如数据吞吐量低，实时性不如一些现代协议（比如EtherCAT）。但在很多场景下，比如环境监控、简单设备控制，它的稳定性和易用性完全够用。

在工业通信的江湖里，Modbus或许不是最快的，也不是最先进的，但它绝对是最实用、最可靠的老朋友。
