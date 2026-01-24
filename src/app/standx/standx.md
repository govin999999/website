# Standx Auto Trade

Standx是一个自动化交易脚本，用于在 TradeGenius 平台上自动执行 USDC/USDT 代币交换操作。

### 📋 脚本信息
- **作者**： @govin
- **版本**： 1.0.0S
- **支持平台**： [Standx](https://standx.com/referral?code=govin)


1. 脚本功能描述
该脚本是一个多线程的自动化交易机器人，包含以下核心模块：

A. 核心功能
多账户并发：支持通过 accounts.json 配置多个钱包账户，每个账户在一个独立的线程中运行，互不干扰。

自动鉴权 (SIWE)：

实现了基于以太坊私钥的签名登录流程（模拟 StandX 的 prepare-signin 和 login 接口）。

自动生成 Session ID 和请求签名，处理 Token 过期和自动重连。

做市策略 (Market Making)：

挂单逻辑：根据当前市场最新价格（Last Price），按照设定的偏移量（BPS）计算目标价格，自动挂出限价单（Limit Order）。

价格跟随：实时监控市场价格。如果市场价格波动导致挂单偏离度超过设定范围（max_bps / min_bps），脚本会自动撤单并重新挂单。

防堆单机制：内置 pickup_or_cleanup_orders 函数，启动时或挂单前会检查链上/API是否有同方向旧单。如果有，则接管旧单或撤销多余订单，防止资金被分散占用。

自动平仓 (Auto-Close)：

脚本每轮循环都会检查持仓。如果发现有持仓（无论多空），会立即以市价（Market Order）全额平仓。这表明该策略主要目的是刷量或赚取挂单奖励，而不持有隔夜风险敞口。

网络优化：

支持配置 HTTP/HTTPS 代理。

包含请求重试机制（Retry）和异常处理，防止网络波动导致脚本崩溃。