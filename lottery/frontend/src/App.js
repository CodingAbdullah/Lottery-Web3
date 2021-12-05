import { Component } from 'react';
import web3 from '../src/web3';
import lottery from '../src/lottery';
import './App.css';

class App extends Component {

  constructor(props){
    super();

    // Initializing state from values of contract
    this.state = {
      manager: lottery.options.address,
      entries: 0,
      prizeValue: 0,
      entryValue: 0,
      msg: ''
    }
  }

  entryListener = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ msg: 'Entering player to pool!' }); // Notify players

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.entryValue, 'ether')
    });

    this.setState({ msg: 'Successful entry!' }); // Update values upon successful entry
    this.setState({ entries: this.state.entries + 1 });

    const balance = await web3.eth.getBalance(lottery.options.address); // Get balance stored in contract and update prize pool
    this.setState({ prizeValue: web3.utils.fromWei(balance, 'ether'), entryValue: 0 });
  }

  pickWinnerListener = () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ msg: 'Picking Winner...' }); // Notify players

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ msg: 'Winner selected!' });
  }
  
  render() {
    return (
      <div className="App">
        <h1>Lottery</h1>
        <p>This contract is managed by {this.state.manager}. There are currently {this.state.entries} people entered, competing to win {this.state.prizeValue} ETH!</p>
        <p>Want to try your luck?</p>
        <form class="first-group">
          <div class="form-group">
            <label>Amount of ether to enter</label><br /><input min="0" type="number" onChange={e => this.setState({ entryValue: e.target.value })}/><br /> 
            <button class="first-button btn btn-primary" onClick={this.entryListener}>Enter</button>  
          </div>
        </form>
        <form class="second-group">
          <div class="form-group">
            <label>Time to pick a winner?</label><br />
            <button class="btn btn-primary" onClick={this.pickWinnerListener}>Pick Winner</button>
          </div>
        </form>
        <label>{this.state.msg}</label>
      </div>
    );
  }
}

export default App;