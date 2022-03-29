import {Component} from 'react'
import React from "react";
import './app.styles.scss';
import axios from "axios";
import {Puff} from "react-loading-icons"

class SuccessScreen extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            phone: '',
            latitude: null,
            longitude: null,
            address: ' ',
            localityType: '',
            anotherLocation: '',
            fetchingLocation: false,
            isFormFilled: false,
        }
    }


    handlePlaceChanged() {
        const place = this.autocomplete.getPlace();
        debugger;
        this.setState({
            address: place,
        })
    }

    handleAnotherPlaceChanged() {
        const place2 = this.autocomplete2.getPlace();
        debugger;
        this.setState({
            anotherLocation: place2,
        })
    }

    onSubmit = e => {
        debugger;
        axios.post('https://sheet.best/api/sheets/6c941f48-186b-4760-9bcf-742353634741', {
            name: this.state.name,
            phone: this.state.phone,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            locality: this.state.localityType,
        }).then(response => {
            debugger;
            console.log('Form submission successful!!');
            alert('Form submission successful!!');
        }).catch((err) => {
            debugger;
            alert('Form submission failed !!');
        })
    }

    validatePhoneNumber(input_str) {
        var re = /(6|7|8|9)\d{9}/;

        return re.test(input_str);
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value}, () => {
            const isLocationFetched = (this.state.latitude !== null && this.state.longitude !== null) || this.state.address !== "";
            const isFormFilled = this.state.name !== '' && this.state.phone !== '' && this.validatePhoneNumber(this.state.phone) && isLocationFetched && this.state.localityType !== "";
            this.setState({isFormFilled: isFormFilled});
            // console.log([e.target.name] + ',' + e.target.value);
            console.log('is name filled : ' + this.state.name !== '');
            console.log('is Phone valid : ' + this.validatePhoneNumber(this.state.phone));
            console.log('is Location fetched : ' + isLocationFetched);
            console.log('isFormFilled : ' + this.state.isFormFilled);
            console.log(this.state);
        });
    }

    getCoordinates = (e) => {
        this.setState({fetchingLocation: true});
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                latitude: position.coords.latitude, longitude: position.coords.longitude, fetchingLocation: false,
            }, () => {
                const isLocationFetched = (this.state.latitude !== null && this.state.longitude !== null) || this.state.address !== "";
                const isFormFilled = this.state.name !== '' && this.state.phone !== '' && this.validatePhoneNumber(this.state.phone) && isLocationFetched && this.state.localityType !== "";
                this.setState({isFormFilled: isFormFilled});
            });
        });
        e.preventDefault();
    }

    trophy = require('./assets/icons/trophy.png');
    paytm = require('./assets/icons/paytm.png');

    renderSuccessDetails = () => {
        return <div className={'w-full p-6 md:w-2/5'} style={{backgroundColor: '#F2FAEF'}}>
            <img className={'h-8 my-2 self-start'} src={this.props.elogo}/>
            <h2 className="text-xl flex flex-row font-semibold text-left py-5">
                <img className={'w-10 resize self-center mr-4 ml-1'} src={this.trophy}/>
                Yay, you have won a cash reward!
            </h2>
            <div className={'flex flex-row bg-white rounded-md border-elegreen border-dashed border my-4 py-3'}>
                <img className={'resize self-center mr-3 w-1/4 ml-3 px-2'} src={this.paytm}/>
                <p className={'text-l self-center flex flex-row font-semibold'}>₹10 Paytm Cash</p>
            </div>
            <p className="text-sm font-light text-left py-2 opacity-60">Our representative will connect with you to take
                this forward.</p>
        </div>
    }

    playstore = require('./assets/icons/playstore.png');

    renderDownloadEmailSection = () => {
        return <div className={'bg-white p-6'}>
            <div className={'flex flex-row'}>
                <div className={'flex flex-row bg-white w-full rounded-sm border-elegreen bg-bgGreen border mb-4 py-2'}>
                    <img className={'resize self-center w-10 mx-2 p-1'} src={this.playstore}/>
                    <p className={'text-sm self-center flex flex-row font-semibold'}>Download app to redeem rewards</p>
                </div>
            </div>
            <form className="grid grid-cols-1 gap-6">
                <label className="block">
                            <span className="text-black text-sm font-semibold font-normal">
                                Or get on your email
                            </span>
                    <input
                        type="text"
                        name={'name'}
                        className="
                                            mt-1
                                            block
                                            w-full
                                            rounded-sm
                                            border
                                            border-borderGray1
                                            placeholder-gray-400
                                            font-light
                                            text-sm
                                            focus:border-gray-300 focus:bg-white focus:ring-0
                                          "
                        placeholder={'Enter your email address'}
                        onChange={this.changeHandler}
                        required
                    />
                </label>
                <button
                    className={'block w-full py-2 rounded-sm bg-elegreen text-white font-semibold cursor-pointer'}
                    value="Submit">
                    Get reward on email
                </button>
            </form>
        </div>
    }

    whatsapp = require('./assets/icons/whatsapp.png');

    renderReferYourFriend = () => {
        return <div className={'p-6'} style={{backgroundColor: '#F2FAEF'}}>
            <p className={'text-sm self-center flex flex-row font-semibold mb-1'}>Refer your friends and earn more</p>
            <div className={'flex flex-row justify-center bg-white w-full rounded-sm border-elegreen border my-2 py-2 w-1/2'}>
                <img className={'resize self-center w-4 mr-2'} src={this.whatsapp}/>
                <p className={'text-sm text-elegreen self-center flex flex-row font-semibold'}>Refer now</p>
            </div>
        </div>
    }

    render() {
        return (<div className="max-w-xl mx-auto divide-y md:max-w-4xl">
            <div className="flex flex-col md:flex-row">
                {this.renderSuccessDetails()}
                {this.renderDownloadEmailSection()}
                {this.renderReferYourFriend()}
            </div>
        </div>)
    }
}

export default SuccessScreen;