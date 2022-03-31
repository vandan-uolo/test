import {Component} from 'react'

import Logo from './assets/altafino.svg'
import './app.styles.scss'
import Form from "./Form";
import SuccessScreen from "./SuccessScreen";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {browserHistory} from "react-router";
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';


class App extends Component {

    elocation = require('./assets/icons/elocation.png');
    giftBox = require('./assets/icons/gift-box.png');
    elogo = require('./assets/icons/electric_pe_logo.png');

    trackingId = "G-RQJW7QVZPD";

    componentDidMount() {
        ReactGA.initialize(this.trackingId);
        hotjar.initialize(2902908, 6);
    }

    form = <Form history={browserHistory} onFormSubmitSuccess={this.onFormSubmitSuccess} elocation={this.elocation}
                 giftBox={this.giftBox} elogo={this.elogo}/>;
    successScreen = <SuccessScreen history={browserHistory} elocation={this.elocation} giftBox={this.giftBox} elogo={this.elogo}/>;

    render() {
        return (
            <Router history={browserHistory}>
                {/*<div className='flex-1 items-center py-6 justify-center' style={{backgroundColor: '#F2FAEF'}}>*/}
                <Routes>
                    <Route history={browserHistory} path='/' element={this.form}/>
                    <Route history={browserHistory} path='/success' element={this.successScreen}/>
                </Routes>
                {/*</div>*/}
            </Router>
        )
    }
}

export default App
