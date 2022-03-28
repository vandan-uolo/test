import {Component} from 'react'

import Logo from './assets/altafino.svg'
import './app.styles.scss'
import Form from "./Form";
import SuccessScreen from "./SuccessScreen";
import {  BrowserRouter as Router, Routes,  Route} from "react-router-dom";


class App extends Component {

    elocation = require('./assets/icons/elocation.png');
    giftBox = require('./assets/icons/gift-box.png');
    elogo = require('./assets/icons/electric_pe_logo.png');

    form = <Form onFormSubmitSuccess={this.onFormSubmitSuccess} elocation={this.elocation}
                 giftBox={this.giftBox} elogo={this.elogo}/>;

    successScreen = <SuccessScreen elocation={this.elocation} giftBox={this.giftBox} elogo={this.elogo}/>;

    render() {
        return (
            <Router>
                {/*<div className='flex-1 items-center py-6 justify-center' style={{backgroundColor: '#F2FAEF'}}>*/}
                <Routes>
                    <Route path='/' element={this.form}/>
                    <Route path='/success' element={this.successScreen}/>
                </Routes>
                {/*</div>*/}
            </Router>
        )
    }
}

export default App
