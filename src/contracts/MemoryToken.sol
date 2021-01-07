pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract MemoryToken is ERC721Full {
    // * Inherited Constructor
    constructor() public ERC721Full("Memory Token", "MEMTKN") {}

    // * Mint Token
    function mint(address _to, string calldata _tokenURI)
        external
        returns (bool)
    {
        require(_to != address(0), "Address must be valid");
        require(bytes(_tokenURI).length != 0, "Must have a valid URI");

        uint256 _tokenId = totalSupply().add(1);
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        return true;
    }
}
