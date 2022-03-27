import { Component } from 'react'

import Logo from './assets/altafino.svg'
import './app.styles.scss'
import Form from "./Form";

class App extends Component {
  render() {
    return (
      <div className='flex-1 items-center justify-center m-10 mx-24'>
        <div className='text-black bg-green-100 font-bold rounded-lg border shadow-lg p-10'>
          <Form/>
        </div>
      </div>
    )
  }
}

export default App
