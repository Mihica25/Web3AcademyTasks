// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOMembershipNFT is ERC721Enumerable, Ownable {
    uint256 public constant MINT_PRICE = 0.01 ether;

    constructor() ERC721("DAO Membership", "DAOM") Ownable(msg.sender) {}

    function mint() external payable {
        require(balanceOf(msg.sender) == 0, "Already minted");
        require(msg.value == MINT_PRICE, "Incorrect ETH sent");

        _safeMint(msg.sender, totalSupply());
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
