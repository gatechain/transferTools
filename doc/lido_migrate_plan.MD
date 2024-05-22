## LSD Contract Methods Replacement

### 功能：质押ETH成stETH

- 原LSD方法：
    - ```function lidoDeposit() external  payable nonReentrant whenNotPaused returns(uint amount) { ... }```
- 替换方案：前端 调用lido合约的submit()方法
    - 传参 1、_referral (address)  2、payableAmount(ether)
    - lido合约地址： 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F
- 交互优化：
    - (UI已有)发起质押操作前，客户段判断：账户余额数量是否足够。
    - 质押前，判断质押池是否已满

### 功能：发起stETH提现申请

- 原LSD方法：
    - ```function lidoWithdrawals(uint[] calldata _amounts,address owner,PermitInput calldata _permit) external nonReentrant whenNotPaused returns(uint[] memory requestIds){}```
- 替换方案：前端 调用unstETH合约的requestWithdrawalsWithPermit()方法
    - 传参： 1、_amounts (uint256[]) 2、_owner (address) 3、_permit (tuple)
        - _permit包括：value (uint256)、deadline (uint256)、v (uint8)、 r (bytes32)、 s (bytes32)
    - unstETH合约地址： 0xE42C659Dc09109566720EA8b2De186c2Be7D94D9
- 交互优化：
    - (UI已有)发起提现操作前，客户段判断：当前账户余额，是否足够提现。

### 功能：发起wstETH提现申请

- 原LSD方法：
    - ```function lidoWithdrawalsWstETH(uint[] calldata _amounts,address owner,PermitInput calldata _permit) external nonReentrant whenNotPaused returns(uint[] memory requestIds){}```
- 替换方案：前端 调用unstETH合约的requestWithdrawalsWstETHWithPermit()方法
    - 传参： 1、_amounts (uint256[]) 2、_owner (address) 3、_permit (tuple)
        - _permit包括：value (uint256)、deadline (uint256)、v (uint8)、 r (bytes32)、 s (bytes32)
    - unstETH合约地址： 0xE42C659Dc09109566720EA8b2De186c2Be7D94D9
- 交互优化：
    - (UI已有)发起提现操作前，客户段判断：当前账户余额，是否足够提现。

### 功能：发起Claim操作

- LSD方法：
- ```function lidoClaimWithdrawals(uint256[] calldata _requestIds, uint256[] calldata _hints) external nonReentrant whenNotPaused {}```
    - 参数说明： requestIds；
        - requestIds来源：钱包地址发起一次提现申请后，会先从该地址账户销毁这笔提现金额，同时给该地址铸造的一个nft，一个requestId对应着一个nft的编号Id。
            - 即：多笔提现申请，对应着多个nft，即对应着一个requestId的数组。
        - 可通过unstETH合约的getWithdrawalRequests(ownerAddress)方法，获取所属该地址的所有的nft的Ids，即requestIds
            - 注意：需要筛选状态为claimable的requestID，再执行发起claim操作。
        - requestIds使用场景：
            - 可通过unstETH合约的getWithdrawalStatus()方法，查看所属该地址的nft的状态。
            - 属性：isClaimable，bool类型。判断当前nft(requestID)是否可以进行claim
            - 属性：isFinalized，bool类型。判断当前nft(requestID)是否已经完成claim。
    - 参数说明： hints
        - 可通过unstETH合约的findCheckpointHints(requestIdList, 1, _lastIndex)获取
            - 参数requestIdList，需筛选状态为可claim的requestId集合。
                - 且 需要从小到大排序sort。
            - 参数lastIndex: 可通过unstETH合约的getLastCheckpointIndex()方法获取，属于lido内部的计数设计，无需深究。
    - unstETH合约地址： 0xE42C659Dc09109566720EA8b2De186c2Be7D94D9
- NOTE: 目前该功能，可通过LSD合约 或 lido官方合约调用，上述参数一样。
    - Lido官方合约地址：0x889edc2edab5f40e902b864ad4d7ade8e412f9b1

### 功能：质押ETH到wstETH

- 原LSD方法：
    - ```function lidoDeposit2wstEth() external payable nonReentrant whenNotPaused returns(uint wstEthAmount) { ... }```
- 替换方案： 前端 需调用合约两次，一：质押成stETH，二：wrap成wstETH
- 交互优化：
    - 质押前，判断池子是否已满

### 功能：包裹stETH成wstETH

- 原LSD方法：
    - ```function lidoWrap2wstEth(uint inAmount) external nonReentrant whenNotPaused returns(uint outAmount){ ... }```
- 替换方案：前端 调用 wstETH合约的 wrap()方法； 授权wstETH合约，操作用户stETH数量的操作。
    - 传参： _stETHAmount (uint256)
    - wstETH合约地址： 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0
- 交互优化：
    - (UI已有)发起包裹操作前，客户段判断：当前账户余额，是否足够包裹。

### 功能：解包裹wstETH 成 stETH

- 原LSD方法：
    - ```function lidoUnwrap2stEth(uint inAmount) external nonReentrant whenNotPaused returns(uint outAmount){ ... }```
- 替换方案：前端 调用 wstETH合约的 unwrap()方法 ； 授权wstETH合约，操作用户stETH数量的操作。
    - 传参： _wstETHAmount (uint256)
    - wstETH合约地址： 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0
- 交互优化：
    - (UI已有)发起解包裹操作前，客户段判断：当前账户余额，是否足够解包裹。

### 功能：判断Lido池是否已满

- 原LSD方法：
    - ``` function getLidoIsFull(uint amount) public view returns(bool bools){...} ```
- 替换方案：前端 调用 stETH合约的 getCurrentStakeLimit()方法，返回当前池子允许质押的数量。
    - 无需传参
    - stETH合约地址： 0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb

### 功能：获取stETH到wstETH的置换率

- 原LSD方法：
    - ```function getLidoExchangeRate(bool st2wst) public view returns(uint outAmount){...} ```
- 替换方案：前端 调用 wstETH合约的 getWstETHByStETH()方法，返回输入数量的stETH，可置换出的wstETH数量。
    - 传参： _wstETHAmount (uint256)
    - wstETH合约地址： 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0

### 功能：获取wstETH到stETH的置换率

- 原LSD方法：
    - ```function getLidoExchangeRate(bool st2wst) public view returns(uint outAmount){...} ```
- 替换方案：通过 wstETH合约的 getStETHByWstETH()方法，返回输入数量的wstETH，可置换出的stETH数量。
    - 传参： _wstETHAmount (uint256)
    - wstETH合约地址： 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0

### Tip

- getTotalPooledEther:
    - 可获取lido池子当前数量，可能前端有用