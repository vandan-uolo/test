import React, {Component} from 'react'
import './app.styles.scss';
import axios from "axios";
import {Puff} from "react-loading-icons"
import {browserHistory, Link} from "react-router";
import SuccessScreen from "./SuccessScreen";
import {hotjar} from "react-hotjar";

export const footer = () => {
    return <div style={{backgroundColor: '#F5F5F5', padding: 24}}>
        <a href={'https://Electricpe.com'}>
            <p className={'text-sm text-borderGray pb-2'}>ElectricPe website</p>
        </a>
        <a>
            <p className={'text-sm text-borderGray pb-2'}> Follow Us </p>
        </a>
        <div className={'flex flex-row my-2'}>
            <a href={'https://www.linkedin.com/company/electricpe/'}>
                <img className={'w-6 resize self-center mr-4'} src={require('./assets/icons/linkedin.png')}/>
            </a>
            <a href={'https://twitter.com/GoElectricPe'}>
                <img className={'w-6 resize self-center mr-4'} src={require('./assets/icons/twitter.png')}/>
            </a>
            <a href={'https://www.instagram.com/goelectricpe/'}>
                <img className={'w-6 resize self-center'} src={require('./assets/icons/insta.png')}/>
            </a>
        </div>
        <div className={'mt-12 mb-5'}>
            <img className={'w-28 resize self-center'} src={require('./assets/icons/electric_pe_logo.png')}/>
            <p className="text-borderGray text-xs font-normal mt-1">🇮🇳 Ab India Chalega ElectricPe</p>
        </div>
        <p className="text-borderGray text-xs opacity-60 font-normal">Whatapp Technologies Private Limited</p>
    </div>
}

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
            showLocationAccessError: false,
            isSubmitClicked: true,
        }
    }

    componentDidMount() {
        const bangaloreBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(12.864162, 77.438610),
            new google.maps.LatLng(13.139807, 77.711895));
        this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
            {
                bounds: bangaloreBounds,
                strictBounds: true,
                componentRestrictions: {country: "in"},
            }
        );
        this.autocomplete2 = new google.maps.places.Autocomplete(this.autocompleteInput2.current,
            {
                bounds: bangaloreBounds,
                strictBounds: true,
                componentRestrictions: {country: "in"},
            }
        );

        this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
        this.autocomplete2.addListener('place_changed', this.handleAnotherPlaceChanged);
    }

    handlePlaceChanged() {
        console.log('Called');
        const place = this.autocomplete.getPlace();
        this.setState({
            address: place?.formatted_address,
        }, () => {
            this.setState({
                isFormFilled: this.isFormFilled()
            });
        })
        console.log(this.state.address);
    }

    handleAnotherPlaceChanged() {
        console.log('Called');
        const place2 = this.autocomplete2.getPlace();
        this.setState({
            anotherLocation: place2?.formatted_address,
        })
        this.isFormFilled()
        console.log(this.state.anotherLocation);
    }

    onPhoneNumberEntered = () => {
        console.log('Phone input unfocused');
        if(this.validatePhoneNumber(this.state.phone)){
            console.log('Phone number validated');
            axios.post('https://sheet.best/api/sheets/6c941f48-186b-4760-9bcf-742353634741', {
                Name: '',
                Phone: this.state.phone.slice(this.state.phone.length - 10),
                Latitude: '',
                Longitude: '',
                Locality: '',
                Address: '',
                Locality2: '',
                Address2: '',
            }).then(response => {
                console.log('Phone number submitted');
            }).catch((err) => {
                console.log('Phone number submission failed');
            })
        }
    }

    onSubmit = e => {
        console.log('Form submitted');
        this.setState({
            formSubmitted: true,
            isSubmitClicked: false,
        });
        const url = `https://sheet.best/api/sheets/6c941f48-186b-4760-9bcf-742353634741/Phone/*${this.state.phone.slice(this.state.phone.length - 10)}*`;
        axios.patch(url, {
            Name: this.state.name,
            Latitude: this.state.latitude,
            Longitude: this.state.longitude,
            Locality: this.state.localityType,
            Address: this.state.address,
            Locality2: this.state.anotherLocalityType,
            Address2: this.state.anotherLocation ? this.state.anotherLocation : 'Not provided',
        }).then(response => {
            window.scrollTo(0, 0);
            this.setState({
                formSuccess: true,
            })
        }).catch((err) => {
            alert('Form submission failed !!');
        })
        hotjar.identify(`${this.state.phone}`, {name: this.state.name});
        e.preventDefault();
    }

    validatePhoneNumber(input_str) {
        var re = /(6|7|8|9)\d{9}/;

        return re.test(input_str);
    }

    isFormFilled = () => {
        const isLocationFetched = this.state.latitude !== null && this.state.longitude !== null;
        const isAddressEntered = this.state.address !== "";
        const isAddressReceived = isLocationFetched || isAddressEntered;
        console.log('isLocationFetched :' + isLocationFetched);
        console.log('isAddressEntered :' + isAddressEntered);
        console.log('isAddressReceived :' + isAddressReceived);
        const isFormFilled = this.state.name !== '' && this.state.phone !== '' && this.validatePhoneNumber(this.state.phone) && isAddressReceived && this.state.localityType !== "";
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
            console.log(JSON.stringify(res));
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
            }, (error) => {
                if (error?.code === 1) {
                    this.setState({
                        showLocationAccessError: true,
                        fetchingLocation: false,
                    })
                }
            });
        e.preventDefault();
    }


    renderContent = () => {
        return <div className={'w-full p-5 md:w-full'} style={{backgroundColor: '#F2FAEF'}}>
            <img className={'h-8 my-2 self-start'} src={this.props.elogo}/>
            <h2 className="text-4xl font-semibold text-left py-5">
                Suggest and <br/><span className={'text-elegreen'}>Earn.</span></h2>
            <p className="text-lg  font-light text-left py-2 opacity-60">Help India’s largest Charging Station Network
                to
                setup locations and exciting cash rewards </p>
            <h3 className={'mt-5 font-semibold'}>How it works?</h3>
            <div className={'flex flex-row mb-10 mt-2'}>
                <div className={"w-1/3 bg-white m-1 py-4 px-2 flex flex-col rounded-sm text-center justify-center"}>
                    <img className={'h-7 w-7 self-center'} src={this.props.elocation}/>
                    <p className={"text-xs mt-2"}>Suggest a nearby location</p>
                </div>
                <div className={"w-1/3 bg-white m-1 py-4 px-2 flex flex-col rounded-sm text-center justify-center"}>
                    <img className={'h-7 w-7 self-center'} src={this.props.giftBox}/>
                    <p className={"text-xs mt-2"}>Get cash rewards on suggestions</p>
                </div>
                <div className={"w-1/3 bg-white m-1 py-4 px-2 flex flex-col rounded-sm text-center justify-center"}>
                    <img className={'h-7 w-7 self-center'} src={require('./assets/icons/share.png')}/>
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
            <p className="text-xl font-normal text-left font-semibold mb-5">Let’s start with a quick intro?</p>
            <form className="grid grid-cols-1 gap-6">
                <label className="block">
            <span className="text-gray-700 text-sm font-semibold font-normal">
            Full Name
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
            <p className="text-borderGray text-xs font-normal"> Trust us, we won’t spam you</p>
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
                                            text-borderGray
                                            placeholder-gray-400
                                            font-light
                                            focus:border-gray-300 focus:bg-white focus:ring-0
                                          "
                        value={this.state.phone}
                        onBlur={this.onPhoneNumberEntered}
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
                        <p className="text-borderGray text-xs font-normal">Doesn’t need to be owned by you</p>
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
                    {this.state.showLocationAccessError &&
                        <p className="text-red-700 text-right text-xs pt-2 font-normal">
                            Location Access Error!! <br/>Please enable location access and try again.<br/>(<b>Settings
                            -> Security & Privacy -> Location : Allow</b>)
                        </p>}
                    <p className="text-gray-700 my-3 text-center font-normal">or</p>
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
                <div className={this.state.showAnotherLocation === 'Yes' ? '' : 'hidden'}>
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
                </div>
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
                           this.state.isFormFilled && this.state.isSubmitClicked && this.onSubmit(e)
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
        return (<div className="max-w-xl mx-auto divide-y md:max-w-2xl" style={{backgroundColor: '#F2FAEF'}}>
            <div className="flex flex-col max-w-xl mx-auto divide-y md:max-w-xl">
                {this.state.formSuccess ?
                    <SuccessScreen
                        history={browserHistory}
                        elocation={this.props.elocation}
                        giftBox={this.props.giftBox}
                        elogo={this.props.elogo}
                        name={this.state.name}
                        rewardAmount={this.state.anotherLocation !== '' ? 20 : 10}
                    />
                    : <>
                        {this.renderContent()}
                        {this.renderForm()}
                    </>}
                {footer()}
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
