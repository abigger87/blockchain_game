import React, { Component } from 'react';
import MemoryToken from '../abis/MemoryToken.json'

class Main extends Component {

  async componentWillMount() {
    await this.loadBlockchainData();
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  constructor(props) {
    super(props)
    this.state = {
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: [],
      token: null
    }
  }

  async loadBlockchainData() {
    if(window) {
      const web3 = window.web3

      // * Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = MemoryToken.networks[networkId]
  
      // * Only continure if network data
      if(networkData) {
        const token = new web3.eth.Contract(MemoryToken.abi, networkData.address)
        this.setState({ token })
        console.log(token)
      } else {
        window.alert('MemoryToken contract not deployed to detected network.')
      }
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(this.state.cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    }
    else if(this.state.cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/blank.png'
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if(optionOneId === optionTwoId) {
      alert('You have clicked the same image!')
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('You found a match')
      console.log(this.state.token)
      console.log(this.state.token.methods)
      this.state.token.methods.mint(
        this.props.account,
        window.location.origin + this.state.cardArray[optionOneId].img.toString()
      )
      .send({ from: this.props.account })
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId]
        })
        this.props.setTokenURIs([...this.props.tokenURIs, this.state.cardArray[optionOneId].img])
      })
    } else {
      alert('Sorry, try again')
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    if (this.state.cardsWon.length === this.state.cardArray.length) {
      alert('Congratulations! You found them all!')
    }
  }

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Start matching now!</h1>

                <div className="grid mb-4" >

                  { this.state.cardArray.map((card, key) => {
                    return(
                      <img
                        key={key}
                        alt={key}
                        src={this.chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          console.log(cardId)
                          if(!this.state.cardsWon.includes(cardId.toString())) {
                            this.flipCard(cardId)
                          }
                        }}
                      />
                    )
                  })}


                </div>

                <div>

                  <h5>Tokens Collected:<span id="result">&nbsp;{this.props.tokenURIs.length}</span></h5>

                  <div className="grid mb-4" >

                    { this.props.tokenURIs.map((tokenURI, key) => {
                      return(
                        <img
                          key={key}
                          alt={tokenURI}
                          src={tokenURI}
                        />
                      )
                    })}

                  </div>

                </div>

              </div>

            </main>
        </div>
      </div>
    );
  }
}

export default Main;

const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]