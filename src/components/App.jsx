import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import { Main, Navbar } from "./";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      memory_token: null,
      totalSupply: 0,
      tokenURIs: [],
      loading: true
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window && window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    if(window) {
      const web3 = window.web3

      // * Load account
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      
      // * Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = MemoryToken.networks[networkId]
  
      // * Only continure if network data
      if(networkData) {
        const memory_token = new web3.eth.Contract(MemoryToken.abi, networkData.address)
        this.setState({ memory_token })

        const totalSupply = await memory_token.methods.totalSupply().call({ from: accounts[0] });
        this.setState({ totalSupply })

        let balanceOf = await memory_token.methods.balanceOf(accounts[0]).call();
        for(let i = 0; i < balanceOf; i++) {
          let id = await memory_token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
          let tokenURI =  await memory_token.methods.tokenURI(id).call();
          this.setState({tokenURIs: [ ...this.state.tokenURIs, tokenURI ]})
        }
        this.setState({ loading: false})
        
      } else {
        window.alert('MemoryToken contract not deployed to detected network.')
      }
    }
  }

  setTokenURIs = (arr) => {
    this.setState({
      tokenURIs: arr
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><h3>Loading...</h3></div>
          : <Main 
              tokenURIs={this.state.tokenURIs}
              account={this.state.account}
              totalSupply={this.state.totalSupply}
              setTokenURIs={this.setTokenURIs}
            />
        }
      </div>
    );
  }
}

export default App;
