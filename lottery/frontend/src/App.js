import { Component } from 'react';
import web3 from 'web3';
import './App.css';

class App extends Component {

  constructor(props){
    super();

    this.state = {
      manager: '',
      entries: 0,
      prizeValue: 0,
      msg: ''
    }
  }

  entryListener = () => {

  }

  pickWinnerListener = () => {

  }
  
  render() {
    return (
      <div className="App">
        <h1>Lottery</h1>
        <p>This contract is managed by {}. There are currently {} people entered, competing to win {} ETH!</p>
        <p>Want to try your luck?</p>
        <form class="first-group">
          <div class="form-group">
            <label>Amount of ether to enter</label><br /><input min="0" type="number" /><br /> 
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