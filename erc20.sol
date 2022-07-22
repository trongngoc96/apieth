// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract ERC20 is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
	address public owner;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    uint256 ethavailable = 0;

    uint256 price = 0;

    address[] public arrAddress;

    mapping (address => userInfo) public trust;

    struct userInfo {
        uint256 timestamp;
        uint256 amount;
        uint256 token;
    }

    constructor(
        uint256 initialSupply,
        string memory tokenName,
        uint8 decimalUnits,
        string memory tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
		owner = msg.sender;
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function iprice(uint256 amount) public {
        price = amount;
    }

    function getPrice() public view returns(uint256) {
        return price;
    }

    function mint(uint amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function deposit(uint256 amount) payable public {
        trust[msg.sender].timestamp = block.timestamp;
        trust[msg.sender].amount += amount;
        trust[msg.sender].token = amount/price;
        arrAddress.push(msg.sender);
        ethavailable += amount;
        // luu them thong tin addres user
        // TODO do songthing then
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getArrayAddress() public view returns(address [] memory) {
        return arrAddress;
    }

    function confirm(address _to) public {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        this.transfer(_to, trust[_to].token);
    }

    //withdral toan phan
    function reject(address _to) public { //phai la chu hop dong
      //transfer den nhung thang co trong mang roi sau do xoa
      require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        address payable to = payable(_to);
        to.transfer(trust[to].amount);
    }
    function withdraw(address _to, uint256 _value) public { //phai la chu hop dong
      require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        require(_value >= ethavailable, "Insufficient Balance");
        address payable to = payable(_to);
        to.transfer(_value);
    }
}