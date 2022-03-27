import {Component} from 'react'
import React from "react";
import './app.styles.scss';
import axios from "axios";
import {Puff} from "react-loading-icons";

class Form extends Component {
    constructor() {
        super();
        this.autocompleteInput = React.createRef();
        this.autocompleteInput2 = React.createRef();
        this.autocomplete = null;
        this.autocomplete2 = null;
        this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
        this.state = {
            name: '',
            phone: '',
            latitude: null,
            longitude: null,
            address: '',
            localityType: '',
            anotherLocation: '',
            fetchingLocation: false,
            isFormFilled: false,
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
        const isFormFilled = this.state.name !== '' && this.state.phone !== '' && ((this.state.latitude !== null && this.state.longitude !== null) || this.state.address !== null) && this.state.anotherLocation !== null;
        console.log('isFormFilled : ' + isFormFilled);

        isFormFilled && axios.post('https://sheet.best/api/sheets/6c941f48-186b-4760-9bcf-742353634741', {
            name: this.state.name,
            phone: this.state.phone,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            address: this.state.address,
            locality: this.state.localityType,
        })
            .then(response => {
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
            const isFormFilled = this.state.name !== '' &&
                this.state.phone !== '' && this.validatePhoneNumber(this.state.phone) &&
                isLocationFetched &&
                this.state.localityType !== "";
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
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                fetchingLocation: false,
            }, () => {
                const isLocationFetched = (this.state.latitude !== null && this.state.longitude !== null) || this.state.address !== "";
                const isFormFilled = this.state.name !== '' &&
                    this.state.phone !== '' && this.validatePhoneNumber(this.state.phone) &&
                    isLocationFetched &&
                    this.state.localityType !== "";
                this.setState({isFormFilled: isFormFilled});
            });
        });
        e.preventDefault();
    }

    render() {
        return (<div className="max-w-xl mx-auto divide-y md:max-w-4xl">
            <div className="flex flex-row">
                <div className={'pr-12 w-2/3'}>
                    <h2 className="text-3xl font-bold text-left py-5">
                        The future is Electric. Be part of it. </h2>
                    <p className="text-l font-normal text-left py-2">ElectricPe is India's largest Electric
                        Vehicle Charging Stations Network. Electric Vehicle Ecosystem needs more and more distributed
                        charging stations to help
                        champions like you to switch to electric.</p>
                    <p className="text-l font-normal left py-2">Help ElectricPe by suggesting a location in
                        and around your premises and win exciting rewards and EV Prizes. We'll start by collecting some
                        basic demographic information.</p>
                </div>
                <div className="mt-8 m-auto">
                    <p className="text-l font-normal text-left font-bold">You just have to suggest the location, We
                        will do the rest to electrify your location.</p>
                    <form className="grid grid-cols-1 gap-6">
                        <label className="block">
                            <span className="text-gray-700 font-normal">
                                Please tell us your full name?
                                <span className="text-red-600 font-normal"> *</span>
                            </span>
                            <input
                                type="text"
                                name={'name'}
                                className="
                                            mt-1
                                            block
                                            w-full
                                            rounded-md
                                            bg-gray-100
                                            border-transparent
                                            focus:border-gray-500 focus:bg-white focus:ring-0
                                          "
                                placeholder={'Your name'}
                                onChange={this.changeHandler}
                                required
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700 font-normal">
                                Please tell us your phone number
                                <span className="text-red-600 font-normal"> *</span>
                            </span>
                            <input
                                type="text"
                                name={'phone'}
                                className="
                                            mt-1
                                            block
                                            w-full
                                            rounded-md
                                            bg-gray-100
                                            border-transparent
                                            focus:border-gray-500 focus:bg-white focus:ring-0
                                          "
                                placeholder="+91-9876543210"
                                pattern="(6|7|8|9)\d{9}"
                                onChange={this.changeHandler}
                                required
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700 font-normal">
                                Please suggest the location where you
                                would want to have an Electric Vehicle Charging Station?
                                <span className="text-red-600 font-normal"> *</span>
                            </span>
                            {this.state.fetchingLocation && <Puff stroke="#000"/>}
                            {this.state.latitude !== null && this.state.longitude !== null &&
                                <p className="text-green-500 my-3 font-normal">Location fetch successful !!</p>}
                            {this.state.latitude == null && this.state.longitude == null && <button className="
                                                block
                                                mt-3
                                                py-3
                                                px-5
                                                rounded-md
                                                bg-gray-100
                                                border-transparent
                                                focus:border-black-500 focus:ring-1
                                              "
                                                                                                    onClick={(e) => this.getCoordinates(e)}
                            >Use current location
                            </button>}
                            <p className="text-gray-700 my-3 font-normal">OR</p>
                            <input
                                type="text"
                                name={"address"}
                                ref={this.autocompleteInput}
                                id="autocomplete"
                                placeholder="Search your location..."
                                className="
                                            mt-1
                                            block
                                            w-full
                                            rounded-md
                                            bg-gray-100
                                            border-transparent
                                            focus:border-gray-500 focus:bg-white focus:ring-0
                                          "
                                type="text"/>
                        </label>
                        <label className="block">
                            <span className="text-gray-700 font-normal">
                                What type of place is this?
                                <span className="text-red-600 font-normal"> *</span>
                            </span>
                            <select
                                className="
                                                block
                                                w-full
                                                mt-1
                                                rounded-md
                                                bg-gray-100
                                                border-transparent
                                                focus:border-gray-500 focus:bg-white focus:ring-0
                                              "
                                onChange={this.changeHandler}
                                name={'localityType'}
                                required
                            >
                                <option>Apartment</option>
                                <option>Independent Home</option>
                                <option>Office</option>
                                <option>School/College</option>
                                <option>Restaurants/Cafe</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-gray-700 font-normal">Suggest another location?</span>
                            <input
                                type="text"
                                name={"anotherLocation"}
                                ref={this.autocompleteInput2}
                                placeholder="Search your location..."
                                className="
                                            mt-1
                                            block
                                            w-full
                                            rounded-md
                                            bg-gray-100
                                            border-transparent
                                            focus:border-gray-500 focus:bg-white focus:ring-0
                                          "
                                type="text"/>
                        </label>
                        <div className="block">
                            <div className="flex flex-row justify-end">
                                <button className={this.state.isFormFilled ?
                                    'block m-1 px-10 py-3 rounded-md bg-green-500 text-white border-transparent cursor-pointer' :
                                    'block m-1 px-10 py-3 rounded-md bg-gray-300 text-white border-transparent cursor-pointer'}
                                        onClick={this.onSubmit}
                                        disabled={!this.state.isFormFilled}
                                        value="Submit">Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
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
