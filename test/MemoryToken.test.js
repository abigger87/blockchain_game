const { assert } = require('chai');

const MemoryToken = artifacts.require('./MemoryToken.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Memory Token', (accounts) => {
  
  let memory_token;

  before(async () => {
    memory_token = await MemoryToken.deployed()
  });

  describe('Basic Deployment Details', async () => {
    it('Verify Name', async () => {
      // * Verify Name
      let name = await memory_token.name();
      assert.equal(name, "Memory Token");
    });

    it('Verify Symbol', async () => {
      // * Verify Symbol
      let symbol = await memory_token.symbol();
      assert.equal(symbol, "MEMTKN");
    });

    it('Null Check Address', async () => {
      // * Null check address
      let address = memory_token.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe('Minting Token', async () => {
    let result;

    before(async () => {
      await memory_token.mint(accounts[0], 'https://www.token-uri.com/nft');
    });

    it('Increases Total Token Supply', async () => {
      result = await memory_token.totalSupply();
      assert.equal(result.toString(), '1', 'Total supply is correct.');
    });

    it('Increments Owner Balance', async () => {
      result = await memory_token.balanceOf(accounts[0]);
      assert.equal(result.toString(), '1', 'Owner balance is correct.');
    });

    it('Token Belongs to the Owner', async () => {
      result = await memory_token.ownerOf('1');
      assert.equal(result.toString(), accounts[0].toString(), 'Owner is correct.');
      result = await memory_token.tokenOfOwnerByIndex(accounts[0], 0);
    });

    it('Owner can see all Tokens', async () => {
      let balanceOf = await memory_token.balanceOf(accounts[0]);
      let tokenIds = [];
      for(let i = 0; i < balanceOf; i++) {
        let id = await memory_token.tokenOfOwnerByIndex(accounts[0], i);
        tokenIds.push(id.toString());
      }
      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(), 'Owner Token List is correct.');
    });

    it('Token URI is Correct.', async () => {
      let tokenURI = await memory_token.tokenURI('1');
      assert.equal(tokenURI, 'https://www.token-uri.com/nft');
    })

    it('Fails to Mint Null Tokens', async () => {
      await memory_token.mint(accounts[0], '').should.be.rejected;
      await memory_token.mint(0x0, 'https://www.token-uri.com/nft').should.be.rejected;
      
    })

  });

});
