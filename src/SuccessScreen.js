import {Component} from 'react'
import React from "react";
import './app.styles.scss';
import axios from "axios";
import {Puff} from "react-loading-icons"

class SuccessScreen extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            emailSubmitted: false,
        }
    }


    handlePlaceChanged() {
        const place = this.autocomplete.getPlace();
        this.setState({
            address: place,
        })
    }

    handleAnotherPlaceChanged() {
        const place2 = this.autocomplete2.getPlace();
        this.setState({
            anotherLocation: place2,
        })
    }

    onSubmit = e => {
        const url = `https://sheet.best/api/sheets/04dd312c-fd26-47ad-a751-e8493fbaaa4c/Name/*${this.props.name}*`;
        console.log(url);
        axios.patch(url, {
            Email: this.state.email,
        }).then(response => {
            this.setState({
                emailSubmitted: true,
            })
        }).catch((err) => {
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
        return <div className={'w-full p-6 pb-4'} style={{backgroundColor: '#F2FAEF'}}>
            <img className={'h-8 my-2 self-start'} src={this.props.elogo}/>
            <h2 className="text-xl flex flex-row font-semibold text-left py-5">
                <img className={'w-10 resize self-center mr-4 ml-1'} src={this.trophy}/>
                Yay, you have won a cash reward!
            </h2>
            <div
                className={'flex flex-row bg-white rounded-md border-elegreen border-opacity-60 border-dashed border my-4 py-3'}>
                <img className={'resize self-center mr-3 w-1/4 ml-3 px-2'} src={this.paytm}/>
                <p className={'text-l self-center flex flex-row font-semibold'}>₹{this.props.rewardAmount} Paytm
                    Cash</p>
            </div>
            <p className="text-xs font-semibold text-center pt-1"> ⭐ Get additional ₹1000 if your location is
                approved</p>
            <p className="text-xs font-light text-left py-2 opacity-60">Our representative will connect with you to take
                this forward.</p>
        </div>
    }

    playstore = require('./assets/icons/playstore.png');

    renderDownloadEmailSection = () => {
        return <div className={'bg-white p-6'}>
            <div className={'flex flex-row'}>
                <a href={'https://play.google.com/store/apps/details?id=com.wattapp.electricpe'}
                   className={'flex flex-row bg-white w-full rounded-sm border-elegreen bg-bgGreen border mb-4 py-2'}>
                    <img className={'resize self-center w-10 mx-2 p-1'} src={this.playstore}/>
                    <p className={'text-sm self-center flex flex-row font-semibold'}>Download app to redeem rewards</p>
                </a>
            </div>
            <form className="grid grid-cols-1 gap-6">
                <label className="block">
                            <span className="text-black text-sm font-semibold font-normal">
                                Or get on your email
                            </span>
                    <input
                        type="email"
                        name={'email'}
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
                    />
                </label>
                {this.state.emailSubmitted ?
                    <p className={'text-elegreen -mt-4 font-normal text-left self-center text-sm'}>
                        Thanks for sharing your email! <br/><span className={'text-xs'}>Your rewards will be shared soon on the above email.</span>
                    </p> : <div
                        className={'block bg-elegreen'}>
                        <a className={'flex flex-row m-1 justify-center pr-3 w-full py-3 text-center rounded-sm border-transparent cursor-pointer'}
                           onClick={(e) => this.onSubmit(e)}
                        >
                            <p className={'text-white font-semibold mr-2 self-center'}>Get reward on email</p>
                            <img className={'w-6 resize self-center'} src={require('./assets/icons/arrowr.png')}/>
                        </a>
                    </div>}
            </form>
        </div>
    }

    whatsapp = require('./assets/icons/whatsapp.png');

    renderReferYourFriend = () => {
        return <div className={'p-6'} style={{backgroundColor: '#F2FAEF'}}>
            <p className={'text-sm self-center flex flex-row font-semibold mb-1'}>Refer your friends and earn more</p>
            <a
                href={`whatsapp://send?text=Hi, I've earned instant cash rewards for sharing locations. ElectricPe is offering rewards for suggesting charging station locations. Check here: **https://suggest.electricpe.com/*`}
                className={'flex flex-row justify-center bg-white w-full rounded-sm border-elegreen border my-2 py-2 w-1/2'}>
                <img className={'resize self-center w-4 mr-2'} src={this.whatsapp}/>
                <p className={'text-sm text-elegreen self-center flex flex-row font-semibold'}>Refer now</p>
            </a>
        </div>
    }

    render() {
        return (<div className="max-w-xl divide-y md:max-w-2xl">
            <div className="flex flex-col">
                {this.renderSuccessDetails()}
                {this.renderDownloadEmailSection()}
                {this.renderReferYourFriend()}
            </div>
        </div>)
    }
}

export default SuccessScreen;