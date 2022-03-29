import React, {Component} from 'react'
import './app.styles.scss';
import axios from "axios";
import {Puff} from "react-loading-icons"
import {browserHistory, Link} from "react-router";
import SuccessScreen from "./SuccessScreen";
import Geocode from "react-geocode";

class Form extends Component {
    constructor() {
        super();
        this.autocompleteInput = React.createRef();
        this.autocompleteInput2 = React.createRef();
        this.autocomplete = null;
        this.autocomplete2 = null;
        this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
        this.handleAnotherPlaceChanged = this.handleAnotherPlaceChanged.bind(this);
        this.state = {
            name: '',
            phone: '+91-',
            latitude: null,
            longitude: null,
            address: '',
            localityType: 'Residential',
            anotherLocalityType: '',
            anotherLocation: '',
            fetchingLocation: false,
            isFormFilled: false,
            formSuccess: false,
            currentLocation: 'Use current location',
            formSubmitted: false,
            showAnotherLocation: '',
        }
    }

    componentDidMount() {
        // var options = {
        //     types: ['geocode'],
        //     componentRestrictions: {country: "india", state: "bangalore"}
        // };
        this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current, {"types": ["geocode"]});
        this.autocomplete2 = new google.maps.places.Autocomplete(this.autocompleteInput2.current, {"types": ["geocode"]});

        this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
        this.autocomplete2.addListener('place_changed', this.handleAnotherPlaceChanged);
    }

    handlePlaceChanged() {
        console.log('Called');
        const place = this.autocomplete.getPlace();
        this.setState({
            address: place,
        })
        console.log(this.state.address);
    }

    handleAnotherPlaceChanged() {
        console.log('Called');
        const place2 = this.autocomplete2.getPlace();
        this.setState({
            anotherLocation: place2,
        })
        console.log(this.state.anotherLocation);
    }


    onSubmit = e => {
        this.setState({
            formSubmitted: true,
        })
        axios.post('https://sheet.best/api/sheets/6c941f48-186b-4760-9bcf-742353634741', {
            name: this.state.name,
            phone: this.state.phone,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            locality: this.state.localityType,
        }).then(response => {
            this.setState({
                formSuccess: true,
            })
            // console.log('Form submission successful!!');
            // alert('Form submission successful!!');
        }).catch((err) => {
            alert('Form submission failed !!');
        })
        e.preventDefault();
    }

    validatePhoneNumber(input_str) {
        var re = /(6|7|8|9)\d{9}/;

        return re.test(input_str);
    }

    isFormFilled = () => {
        const isLocationFetched = (this.state.latitude !== null && this.state.longitude !== null) || this.state.address !== "";
        console.log('isLocationFetched :' + isLocationFetched);
        const isFormFilled = this.state.name !== '' && this.state.phone !== '' && this.validatePhoneNumber(this.state.phone) && isLocationFetched && this.state.localityType !== "";
        console.log('isFormFilled :' + isFormFilled);
        return isFormFilled;
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value}, () => {
            this.setState({isFormFilled: this.isFormFilled()});
            // console.log([e.target.name] + ',' + e.target.value);
            // console.log('is name filled : ' + this.state.name !== '');
            // console.log('is Phone valid : ' + this.validatePhoneNumber(this.state.phone));
            // console.log('isFormFilled : ' + this.state.isFormFilled);
            // console.log(this.state);
        });
    }

    getAddressText = (position) => {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyBTtJRLw5uHmKp_KepUseYrVABs5sLWYrc`).then((res) => {
            this.setState({
                currentLocation: res?.data?.results[0]?.formatted_address,
                address: res?.data?.results[0]?.formatted_address,
            })
        });
    }

    getCoordinates = (e) => {
        this.setState({fetchingLocation: true});
        navigator.geolocation.getCurrentPosition((position) => {
            this.getAddressText(position);
            this.setState({
                latitude: position.coords.latitude, longitude: position.coords.longitude, fetchingLocation: false,
            }, () => {
                this.setState({isFormFilled: this.isFormFilled()});
            });
        });
        e.preventDefault();
    }


    renderContent = () => {
        return <div className={'w-full p-5 md:w-2/5'} style={{backgroundColor: '#F2FAEF'}}>
            <img className={'h-8 my-2 self-start'} src={this.props.elogo}/>
            <h2 className="text-4xl font-semibold text-left py-5">
                Suggest and <br/><span className={'text-elegreen'}>earn</span></h2>
            <p className="text-sm font-light text-left py-2 opacity-60">Help India’s largest Charging Station Network to
                setup
                locations and exciting cash rewards</p>
            <h3 className={'mt-5 font-semibold'}>How it works?</h3>
            <div className={'flex flex-row mb-10 mt-2'}>
                <div className={"w-1/3 bg-white m-1 py-4 px-2 flex flex-col rounded-sm text-center justify-center"}>
                    <img className={'h-7 w-7 self-center'} src={this.props.elocation}/>
                    <p className={"text-xs mt-2"}>Suggest a location</p>
                </div>
                <div className={"w-1/3 bg-white m-1 py-4 px-2 flex flex-col rounded-sm text-center justify-center"}>
                    <img className={'h-7 w-7 self-center'} src={this.props.giftBox}/>
                    <p className={"text-xs mt-2"}>Redeem your reward</p>
                </div>
                <div className={"w-1/3 bg-white m-1 py-4 px-2 flex flex-col rounded-sm text-center justify-center"}>
                    <img className={'h-7 w-7 self-center'} src={this.props.elocation}/>
                    <p className={"text-xs mt-2"}>Share with friends</p>
                </div>
            </div>
        </div>
    }

    renderPill = (text, isActive = false, onCLick) => {
        return <button
            className={isActive ? 'text-elegreen w-auto bg-bgGreen border-elegreen m-2 justify-center px-4 py-2 font-normal text-center border rounded-sm cursor-pointer' : 'text-black w-auto bg-white border-borderGray1 m-2 justify-center px-4 py-2 font-normal text-center border rounded-sm cursor-pointer'}
            onClick={onCLick}
        >
            {text}
        </button>
    }

    gps = require('./assets/icons/gps.png');

    renderForm = () => {
        return <div className="p-6 pt-8 m-auto bg-white">
            <p className="text-l font-normal text-left font-semibold mb-5">Let’s start with a quick intro?</p>
            <form className="grid grid-cols-1 gap-6">
                <label className="block">
            <span className="text-gray-700 text-sm font-semibold font-normal">
            Your name
            <span className="text-red-600 font-normal"> *</span>
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
                                            border-gray-300
                                            placeholder-gray-400
                                            font-light
                                            focus:border-gray-300 focus:bg-white focus:ring-0
                                          "
                        placeholder={'Type your full name'}
                        onChange={this.changeHandler}
                        required
                    />
                </label>
                <label className="block">
            <span className="text-gray-700 text-sm font-semibold font-normal">
            Phone number
            <span className="text-red-600 font-normal"> *</span>
            </span>
                    <input
                        type="text"
                        name={'phone'}
                        className="
                                            mt-1
                                            block
                                            w-full
                                            rounded-sm
                                            border
                                            border-gray-300
                                            placeholder-gray-400
                                            font-light
                                            focus:border-gray-300 focus:bg-white focus:ring-0
                                          "
                        value={this.state.phone}
                        placeholder="+91-"
                        pattern="(6|7|8|9)\d{9}"
                        onChange={this.changeHandler}
                        required
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700 text-sm font-semibold font-normal">
                    Where would you like to have an EV charging station?
                    <span className="text-red-600 font-normal"> *</span>
                    </span>
                    {/*{this.state.latitude !== null && this.state.longitude !== null &&*/}
                    {/*    <p className="text-elegreen my-3 font-normal">Location fetch successful!</p>}*/}
                    {/*{this.state.latitude == null && this.state.longitude == null &&*/}
                    <a className="block mt-3
                                                py-2
                                                px-5
                                                w-full
                                                text-elegreen
                                                rounded-sm
                                                bg-white
                                                border
                                                flex
                                                flex-row
                                                border-elegreen
                                                focus:border-black-500 focus:ring-0
                                              "
                       onClick={(e) => this.getCoordinates(e)}
                    >
                        {this.state.fetchingLocation ?
                            <div className={'w-5 mr-2 resize self-center'}><Puff size={6} stroke="#4CBB17"/></div> :
                            <img className={'w-5 m-2 resize self-center'} src={this.gps}/>}
                        <p className={this.state.fetchingLocation ? 'ml-5 text-elegreen self-center' : 'ml-0 text-elegreen self-center'}>{this.state.currentLocation}</p>
                    </a>
                    <p className="text-gray-700 my-3 font-normal">OR</p>
                    <input
                        type="text"
                        name={"address"}
                        ref={this.autocompleteInput}
                        id="autocomplete"
                        placeholder="Search a location"
                        className="
                                            mt-1
                                            block
                                            w-full
                                            border
                                            border-gray-300
                                            placeholder-gray-400
                                            font-light
                                            focus:border-gray-300 focus:bg-white focus:ring-0
                                          "
                        type="text"/>
                </label>
                {/*    <label className="block">*/}
                {/*<span className="text-gray-700 text-sm font-normal">*/}
                {/*What type of place is this?*/}
                {/*<span className="text-red-600 font-normal"> *</span>*/}
                {/*</span>*/}
                {/*        <select*/}
                {/*            className="*/}
                {/*                                    block*/}
                {/*                                    w-full*/}
                {/*                                    mt-1*/}
                {/*                                    border*/}
                {/*                                    border-gray-300*/}
                {/*                                    text-gray-400*/}
                {/*                                    placeholder-gray-400*/}
                {/*                                    font-light*/}
                {/*                                    focus:border-gray-500 focus:bg-white focus:ring-0*/}
                {/*                                  "*/}
                {/*            onChange={this.changeHandler}*/}
                {/*            name={'localityType'}*/}
                {/*            required*/}
                {/*        >*/}
                {/*            <option>Apartment</option>*/}
                {/*            <option>Independent Home</option>*/}
                {/*            <option>Office</option>*/}
                {/*            <option>School/College</option>*/}
                {/*            <option>Restaurants/Cafe</option>*/}
                {/*        </select>*/}
                {/*    </label>*/}
                <div className="block">
                    <div>
                        <p className="text-gray-700 text-sm font-semibold font-normal">
                            What type of place is this?
                            <span className="text-red-600 font-normal"> *</span>
                        </p>
                    </div>
                    <div className={'my-5 mt-2'}>
                        {this.renderPill('Residential', this.state.localityType === 'Residential', (e) => {
                            e.preventDefault();
                            this.setState({
                                localityType: 'Residential'
                            });
                        })}
                        {this.renderPill('Office', this.state.localityType === 'Office', (e) => {
                            e.preventDefault();
                            this.setState({localityType: 'Office'});
                        })}
                        {this.renderPill('Warehouse', this.state.localityType === 'Warehouse', (e) => {
                            e.preventDefault();
                            this.setState({localityType: 'Warehouse'});
                        })}
                        {this.renderPill('School / College', this.state.localityType === 'School / College', (e) => {
                            e.preventDefault();
                            this.setState({localityType: 'School / College'});
                        })}
                        {this.renderPill('Restaurant / Hotel', this.state.localityType === 'Restaurant / Hotel', (e) => {
                            e.preventDefault();
                            this.setState({localityType: 'Restaurant / Hotel'});
                        })}
                        {this.renderPill('Others', this.state.localityType === 'Others', (e) => {
                            e.preventDefault();
                            this.setState({localityType: 'Others'});
                        })}
                    </div>
                </div>
                <div className="block">
                    <div>
                        <p className="text-gray-700 text-sm font-semibold font-normal">
                            Do you want to add one more location?
                        </p>
                    </div>
                    <div className={'my-5 mt-2'}>
                        {this.renderPill('Yes', this.state.showAnotherLocation === 'Yes', (e) => {
                            this.setState({
                                showAnotherLocation: 'Yes',
                            })
                            e.preventDefault();
                        })}
                        {this.renderPill('No', this.state.showAnotherLocation === 'No', (e) => {
                            this.setState({
                                showAnotherLocation: 'No',
                            })
                            e.preventDefault();
                        })}
                    </div>
                </div>
                {this.state.showAnotherLocation === 'Yes' && <div>
                    <label className="block w-auto">
                        <p className="text-gray-700 text-sm font-semibold font-normal mb-2">
                            Where would you like to have an EV charging station?
                        </p>
                        <input
                            type="text"
                            name={"anotherLocation"}
                            ref={this.autocompleteInput2}
                            placeholder="Search a location"
                            id="autocomplete2"
                            className="
                                            mt-1
                                            block
                                            w-full
                                            border
                                            border-gray-300
                                            placeholder-gray-400
                                            font-light
                                            focus:border-gray-300 focus:bg-white focus:ring-0
                                          "
                            type="text"/>
                    </label>
                    <div className="block mt-5">
                        <div>
                            <p className="text-gray-700 text-sm font-semibold font-normal">
                                What type of place is this?
                            </p>
                        </div>
                        <div className={'my-5 mt-2'}>
                            {this.renderPill('Residential', this.state.anotherLocalityType === 'Residential', (e) => {
                                e.preventDefault();
                                this.setState({
                                    anotherLocalityType: 'Residential'
                                });
                            })}
                            {this.renderPill('Office', this.state.anotherLocalityType === 'Office', (e) => {
                                e.preventDefault();
                                this.setState({anotherLocalityType: 'Office'});
                            })}
                            {this.renderPill('Warehouse', this.state.anotherLocalityType === 'Warehouse', (e) => {
                                e.preventDefault();
                                this.setState({anotherLocalityType: 'Warehouse'});
                            })}
                            {this.renderPill('School / College', this.state.anotherLocalityType === 'School / College', (e) => {
                                e.preventDefault();
                                this.setState({anotherLocalityType: 'School / College'});
                            })}
                            {this.renderPill('Restaurant / Hotel', this.state.anotherLocalityType === 'Restaurant / Hotel', (e) => {
                                e.preventDefault();
                                this.setState({anotherLocalityType: 'Restaurant / Hotel'});
                            })}
                            {this.renderPill('Others', this.state.anotherLocalityType === 'Others', (e) => {
                                e.preventDefault();
                                this.setState({anotherLocalityType: 'Others'});
                            })}
                        </div>
                    </div>
                </div>}
                {/*<label className="block">*/}
                {/*    <span className="text-gray-700 font-normal">Suggest another location?</span>*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        name={"anotherLocation"}*/}
                {/*        ref={this.autocompleteInput2}*/}
                {/*        placeholder="Search your location..."*/}
                {/*        className="*/}
                {/*                            mt-1*/}
                {/*                            block*/}
                {/*                            w-full*/}
                {/*                            rounded-md*/}
                {/*                            bg-gray-100*/}
                {/*                            border-transparent*/}
                {/*                            focus:border-gray-500 focus:bg-white focus:ring-0*/}
                {/*                          "*/}
                {/*        type="text"/>*/}
                {/*</label>*/}
                <div
                    className={this.state.isFormFilled ? 'block bg-elegreen' : 'block bg-gray-300'}>
                    <a className={'flex flex-row m-1 justify-center pr-3 w-full py-3 text-center rounded-sm border-transparent cursor-pointer'}
                       onClick={(e) => {
                           this.state.isFormFilled && this.onSubmit(e)
                       }}
                    >
                        <p className={'text-white font-semibold mr-2 self-center'}>Submit</p>
                        {this.state.formSubmitted ?
                            <div className={'w-3 resize self-center'}><Puff size={3} stroke="#FFFFFF"/></div> :
                            <img className={'w-6 resize self-center'} src={require('./assets/icons/arrowr.png')}/>}
                    </a>
                </div>
            </form>
        </div>
    }

    render() {
        return (<div className="max-w-xl mx-auto divide-y md:max-w-4xl">
            <div className="flex flex-col md:flex-row">
                {this.state.formSuccess ? <SuccessScreen history={browserHistory}
                                                         elocation={this.props.elocation}
                                                         giftBox={this.props.giftBox}
                                                         elogo={this.props.elogo}/> : <>
                    {this.renderContent()}
                    {this.renderForm()}
                </>}
            </div>
        </div>)
    }
}

export default Form;


{/*<PlacesAutocomplete*/
}
{/*    value={this.state.address}*/
}
{/*    onChange={(address) => this.setState({address: address})}*/
}
{/*    onSelect={this.handleSelect}*/
}
{/*>*/
}
{/*    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (*/
}
{/*        <div>*/
}
{/*            <p>Latitude: {this.state.latitude}</p>*/
}
{/*            <p>Longitude: {this.state.longitude}</p>*/
}

{/*            <input {...getInputProps({ placeholder: "Type address" })} />*/
}

{/*            <div>*/
}
{/*                {loading ? <div>...loading</div> : null}*/
}

{/*                {suggestions.map(suggestion => {*/
}
{/*                    const style = {*/
}
{/*                        backgroundColor: suggestion.active ? "#41b6e6" : "#fff"*/
}
{/*                    };*/
}

{/*                    return (*/
}
{/*                        <div {...getSuggestionItemProps(suggestion, { style })}>*/
}
{/*                            {suggestion.description}*/
}
{/*                        </div>*/
}
{/*                    );*/
}
{/*                })}*/
}
{/*            </div>*/
}
{/*        </div>*/
}
{/*    )}*/
}
{/*</PlacesAutocomplete>*/
}
{/*<Autocomplete*/
}
{/*    apiKey={'AIzaSyBd0lvitLp5dPwDdaYALSO5Jgo6qRm_dcw'}*/
}
{/*    onPlaceSelected={(place) => console.log(place)}*/
}
{/*/>*/
}
