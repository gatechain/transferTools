// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.18;

interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract TransfersTools {
    address public dev_address;

    constructor() public {
        dev_address = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == dev_address, "msg.sender is not owner");
        _;
    }

    receive() external payable {}

    function transferOwner(address adr) public onlyOwner {
        dev_address = adr;
    }

    function ERC20BatchTransfer(
        address token,
        address[] calldata addrs,
        uint[] calldata values
    ) public onlyOwner {
        require(addrs.length > 0, "length is 0");
        require(addrs.length == values.length, "Length is not current");
        for (uint i = 0; i < addrs.length; i++) {
            IERC20(token).transferFrom(msg.sender, addrs[i], values[i]);
        }
    }

    function EthBatchTransfer(
        address[] calldata addrs,
        uint[] calldata values
    ) public payable onlyOwner {
        require(addrs.length > 0, "length is 0");
        require(addrs.length == values.length, "Length is not current");
        for (uint i = 0; i < addrs.length; i++) {
            payable(addrs[i]).transfer(values[i]);
        }
    }

    function getEth() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    function getERC20Token(address token) public  onlyOwner {
        IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)));
    }
}
