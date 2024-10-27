import { useState } from 'react';
import Button from '@mui/material/Button';
import { MyTextField } from './my-controls';
import { useLight, useRegion } from '../globals/redux-store';
import CryptionHelper from '../../helpers/cryption-helper';
import { useAlert } from './alerts';

const LocationInfoControl = (props) => {
    const { editMode, onLocationSuccess } = props;

    const { showAlert } = useAlert();
    const lightMode = useLight();
    const region = useRegion();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [address1Error, setAddress1Error] = useState('');
    const [address2Error, setAddress2Error] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [zipCodeError, setZipCodeError] = useState('');

    const firstNameChanged = (e) => {
        setFirstName(e.target.value);
    }

    const lastNameChanged = (e) => {
        setLastName(e.target.value);
    }

    const address1Changed = (e) => {
        setAddress1(e.target.value);
    }

    const address2Changed = (e) => {
        setAddress2(e.target.value);
    }

    const cityChanged = (e) => {
        setCity(e.target.value);
    }

    const stateChanged = (e) => {
        setState(e.target.value);
    }

    const zipCodeChanged = (e) => {
        setZipCode(e.target.value);
    }

    const handleNext = async() => {
        const cryptor = new CryptionHelper();
        await cryptor.initialize();

        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('token');

        if (!firstName)
            setFirstNameError('Fist name must be input.')
        if (!lastName)
            setFirstNameError('Last name must be input.')
        if (!address1)
            setFirstNameError('Address line 1 must be input.')
        if (!city)
            setFirstNameError('City must be input.')
        if (!state)
            setFirstNameError('State must be input.')
        if (!zipCode)
            setFirstNameError('Zip code must be input.')
        if (!region)
            setFirstNameError('Country must be valid. Please refresh page.')

        const locationData = {
            email: await cryptor.encrypt(email),
            token: await cryptor.encrypt(token),
            firstName: await cryptor.encrypt(firstName),
            lastName: await cryptor.encrypt(lastName),
            address1: await cryptor.encrypt(address1),
            address2: await cryptor.encrypt(address2),
            city: await cryptor.encrypt(city),
            state: await cryptor.encrypt(state),
            zipCode: await cryptor.encrypt(zipCode),
            country: await cryptor.encrypt(region.country),
        }

        try {
            const response = await fetch(`user/savelocation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(locationData),
            });
            const data = await response.json();

            if (!response.ok) {
                showAlert({ severity: 'error', message: data.message });
                return;
            }
            else {
                const newToken = await crypto.decrypt(data.token);
                console.log(newToken);
                sessionStorage.setItem('token', newToken);
                showAlert({ severity: 'success', message: 'Saved location successfully.' });
                // onLocationSuccess();
            }
        } catch (error) {
            showAlert({ severity: 'error', message: 'Could not found server.' });
        }
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(8vh - 12px)', }}>
                <MyTextField
                    required
                    disabled={editMode}
                    error={firstNameError}
                    name='First Name'
                    id='first-name'
                    style={{ width: 'calc(15vw - 10px)' }}
                    onChange={firstNameChanged}
                />
                <MyTextField
                    required
                    disabled={editMode}
                    error={lastNameError}
                    name='Last Name'
                    id='last-name'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                    onChange={lastNameChanged}
                />
            </div>
            <MyTextField
                required
                error={address1Error}
                name='Address Line 1'
                id='address-line-1'
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                onChange={address1Changed}
            />
            <MyTextField
                error={address2Error}
                name='Address Line 2'
                id='address-line-2'
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                onChange={address2Changed}
            />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(3vh - 12px)', }}>
                <MyTextField
                    required
                    error={cityError}
                    name='City'
                    id='city'
                    style={{ width: 'calc(15vw - 10px)' }}
                    onChange={cityChanged}
                />
                <MyTextField
                    required
                    error={stateError}
                    name='State'
                    id='state'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                    onChange={stateChanged}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(3vh - 12px)', }}>
                <MyTextField
                    required
                    error={zipCodeError}
                    name='Zip / Postal Code'
                    id='zip-code'
                    style={{ width: 'calc(15vw - 10px)' }}
                    onChange={zipCodeChanged}
                />
                <MyTextField
                    required
                    disabled
                    value={region ? region.country : ''}
                    name='Country'
                    id='country'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
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