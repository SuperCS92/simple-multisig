// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20 {
    address private  _wallet;

    uint256 internal constant _tokenUnit = 10**18;
    uint256 internal constant _hundredMillion = 10**8;
    uint256 internal constant _totalSupply = 5 * _hundredMillion * _tokenUnit;

    constructor(address wallet) ERC20("WrappedEthereum", "WETH")  {
       _wallet = wallet;
       _mint(_wallet, _totalSupply);
    }
}