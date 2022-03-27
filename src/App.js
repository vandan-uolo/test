import { Component } from 'react'

import Logo from './assets/altafino.svg'
import './app.styles.scss'
import Form from "./Form";

class App extends Component {
  render() {
    return (
      <div className='flex-1 items-center justify-center h-screen m-10'>
        <div className='text-black font-bold rounded-lg border shadow-lg p-10 m-20'>
          <Form/>
        </div>
      </div>
    )
  }
}

export default App
