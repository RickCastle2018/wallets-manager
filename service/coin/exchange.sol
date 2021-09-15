pragma solidity 0.4.24;

// DRAFT! NOT WORKING!
// Based on https://medium.com/ethereum-developers/your-final-guide-about-creating-simple-and-advanced-ico-smart-contracts-50a7d363417b

contract Exchange {
    uint256 public tokenRate;
    address public tokenAddress;
    address public owner;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function() public payable {
        buy();
    }

    constructor(uint256 _tokenRate, address _tokenAddress) public {
        require(
            _tokenRate != 0 &&
             _tokenAddress != address(0) &&
        );
        tokenRate = _tokenRate;
        tokenAddress = _tokenAddress;
        owner = msg.sender;
    }

    function buy() public payable {
        uint256 tokensToBuy;
        tokensToBuy = ((msg.value * 1e18) / 1 ether) * tokenRate;
        owner.transfer(msg.value);
        coin.buy(msg.sender, tokensToBuy);
    }

}
