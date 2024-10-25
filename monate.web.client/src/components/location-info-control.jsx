import { useState } from 'react';
import Button from '@mui/material/Button';
import { MyTextField } from './my-controls';
import { useLight } from '../globals/redux-store';

const LocationInfoControl = (props) => {
    const { onNext } = props;

    const lightMode = useLight();

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [zipCodeError, setZipCodeError] = useState('');
    const [countryError, setCountryError] = useState('');

    const firstNameChanged = (e) => {

    }

    const lastNameChanged = (e) => {

    }

    const address1Changed = (e) => {

    }

    const address2Changed = (e) => {

    }

    const cityChanged = (e) => {

    }

    const stateChanged = (e) => {

    }

    const zipCodeChanged = (e) => {

    }

    const countryChanged = (e) => {

    }

    const handleNext = () => {
        onNext();
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(8vh - 12px)', }}>
                <MyTextField
                    required
                    name='First Name'
                    id='first-name'
                    style={{ width: 'calc(15vw - 10px)' }}
                    error={firstNameError}
                    onChange={firstNameChanged}
                />
                <MyTextField
                    required
                    name='Last Name'
                    id='last-name'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                    error={lastNameError}
                    onChange={lastNameChanged}
                />
            </div>
            <MyTextField
                required
                name='Address Line 1'
                id='address-line-1'
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                error={addressError}
                onChange={address1Changed}
            />
            <MyTextField
                name='Address Line 2'
                id='address-line-2'
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                onChange={address2Changed}
            />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(3vh - 12px)', }}>
                <MyTextField
                    required
                    name='City'
                    id='city'
                    style={{ width: 'calc(15vw - 10px)' }}
                    error={cityError}
                    onChange={cityChanged}
                />
                <MyTextField
                    required
                    name='State'
                    id='state'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                    error={stateError}
                    onChange={stateChanged}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(3vh - 12px)', }}>
                <MyTextField
                    required
                    name='Zip / Postal Code'
                    id='zip-code'
                    style={{ width: 'calc(15vw - 10px)' }}
                    error={zipCodeError}
                    onChange={zipCodeChanged}
                />
                <MyTextField
                    required
                    name='Country'
                    id='country'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                    error={countryError}
                    onChange={countryChanged}
                />
            </div>
            <Button
                varient='contained'
                onClick={handleNext}
                style={{
                    marginTop: '6vh', width: '17vw', height: '5vh', fontSize: '3vh',
                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#afbfbf'
                }}
            >Next</Button>
        </form>
    )
};

export default LocationInfoControl;