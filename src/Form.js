import React, {Component} from 'react'
import './app.styles.scss';
import axios from "axios";
import {Puff} from "react-loading-icons"
import {Link} from "react-router";

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
            address: ' ',
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
        e.preventDefault();
        // const navigate = useNavigate();
        //
        // if (toDashboard === true) {
        //     return <Navigate to="/dashboard" />;
        // }
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


    renderContent = () => {
        return <div className={'w-full p-5 md:w-2/5'} style={{backgroundColor: '#F2FAEF'}}>
            <img className={'h-8 my-2 self-start'} src={this.props.elogo}/>
            <h2 className="text-4xl font-semibold text-left py-5">
                Suggest and <br/><span className={'text-elegreen'}>earn</span></h2>
            <p className="text-sm font-light text-left py-2 opacity-60">Help India’s largest Charging Station Network to setup
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
                    {this.state.latitude !== null && this.state.longitude !== null &&
                        <p className="text-elegreen my-3 font-normal">Location fetch successful!</p>}
                    {this.state.latitude == null && this.state.longitude == null &&
                        <button className="block
                                                mt-3
                                                py-2
                                                px-5
                                                w-full
                                                text-elegreen
                                                rounded-sm
                                                bg-white
                                                border
                                                border-elegreen
                                                focus:border-black-500 focus:ring-0
                                              "
                        onClick={(e) => this.getCoordinates(e)}
                    >Use current location
                    </button>}
                    {this.state.fetchingLocation && <Puff size={15} stroke="#4CBB17"/>}
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
                <label className="block">
                            <span className="text-gray-700 text-sm font-normal">
                                What type of place is this?
                                <span className="text-red-600 font-normal"> *</span>
                            </span>
                    <select
                        className="
                                                block
                                                w-full
                                                mt-1
                                                border
                                                border-gray-300
                                                text-gray-400
                                                placeholder-gray-400
                                                font-light
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
                <div className="block">
                    <div className="flex flex-row justify-end">
                        <a className={this.state.isFormFilled ?
                            'block m-1 w-full px-10 py-3 text-center rounded-sm bg-elegreen text-white font-semibold border-transparent cursor-pointer' :
                            'block m-1 w-full px-10 py-3 text-center rounded-sm bg-elegreen text-white font-semibold border-transparent cursor-pointer'}
                                onClick={this.onSubmit}
                                disabled={false}
                                // disabled={!this.state.isFormFilled}
                        >Submit
                        </a>
                        {/*<Link to="/success">About Page</Link>*/}
                        {/*<a href={'/success'}>Submit</a>*/}
                    </div>
                </div>
            </form>
        </div>
    }
    render() {
        return (<div className="max-w-xl mx-auto divide-y md:max-w-4xl">
            <div className="flex flex-col md:flex-row">
                {this.renderContent()}
                {this.renderForm()}
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
