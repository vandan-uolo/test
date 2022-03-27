import { Component } from 'react'

import Logo from './assets/altafino.svg'
import './app.styles.scss'
import Form from "./Form";


class App extends Component {
  elocation = require('./assets/icons/elocation.png');
  giftBox = require('./assets/icons/gift-box.png');
  elogo = require('./assets/icons/electric_pe_logo.png');
  render() {
    return (
      <div className='flex-1 items-center py-6 justify-center' style={{backgroundColor: '#F2FAEF'}}>
          <Form elocation={this.elocation} giftBox={this.giftBox} elogo={this.elogo}/>
      </div>
    )
  }
}

export default App
