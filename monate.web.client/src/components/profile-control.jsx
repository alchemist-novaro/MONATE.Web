import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { MyTextField, MyMultilineTextField } from './my-controls';
import { useLight } from '../globals/redux-store';
import CryptionHelper from '../../helpers/cryption-helper';
import { useAlert } from './alerts';

const ProfileControl = (props) => {
    const { onSuccess } = props;

    const firstName = sessionStorage.getItem('firstName');
    const lastName = sessionStorage.getItem('lastName');
    const state = sessionStorage.getItem('state');
    const region = sessionStorage.getItem('region');
    const avatar = sessionStorage.getItem('avatar');

    const [newAvatar, setNewAvatar] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const fileInputRef = useRef(null);

    const { showAlert } = useAlert();
    const lightMode = useLight();

    const handleOpenImage = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSave = async () => {
        if (!title) {
            setTitleError('Title must be valid.');
            return;
        }
        else setTitleError('');
        if (!description) {
            setDescriptionError('Description must be valid.');
            return;
        }
        else setDescriptionError('');

        const cryptor = new CryptionHelper();
        await cryptor.initialize();

        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('token');

        const profileData = {
            email: await cryptor.encrypt(email.tolowerCase()),
            token: await cryptor.encrypt(token),
            avatar: await cryptor.encrypt(newAvatar),
            title: await cryptor.encrypt(title),
            description: await cryptor.encrypt(description),
        };

        try {
            const response = await fetch(`user/saveprofile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();

            if (!response.ok) {
                showAlert({ severity: 'error', message: data.message });
                return;
            }
            else {
                const newToken = await cryptor.decrypt(data.token);
                sessionStorage.setItem('token', newToken);
                sessionStorage.setItem('avatar', newAvatar);
                sessionStorage.setItem('title', title);

                showAlert({ severity: 'success', message: 'Saved profile successfully.' });

                onSuccess(data.state);
            }
        } catch (error) {
            showAlert({ severity: 'error', message: 'Could not found server.' });
        }
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
                type='file'
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <div style={{ marginTop: 'calc(8vh - 12px)', display: 'flex', flexDirection: 'row', width: '30vw' }}>
                {(newAvatar || avatar) ?
                    <img
                        src={newAvatar ? newAvatar : avatar}
                        alt='Preview'
                        onClick={handleOpenImage}
                        style={{ width: '100px', height: '100px', borderRadius: '50px', border: '1px solid #28c' }}
                    /> :
                    <div
                        style={{ backgroundColor: 'deeppink', width: '100px', height: '100px', borderRadius: '50px', border: '1px solid #28c', objectFit: 'cover', textAlign: 'center', fontSize: '85px', color: 'white' }}
                        onClick={handleOpenImage}
                    >
                        {firstName[0].toUpperCase()}
                    </div>
                }
                <div style={{ marginLeft: '1vw' }}>
                    <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '30px', marginTop: '20px', transition: '.3s' }}>
                        {firstName + ' ' + lastName}
                    </div>
                    <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '20px', marginTop: '7px', transition: '.3s' }}>
                        {state + ', ' + region}
                    </div>
                </div>
            </div>
            <MyTextField
                required
                name='Title'
                id='title'
                fontSize='25px'
                error={titleError}
                onChange={handleTitleChange}
                style={{ marginTop: 'calc(7vh - 12px)', width: '30vw' }}
            />
            <MyMultilineTextField
                id='address-line-2'
                error={descriptionError}
                onChange={handleDescriptionChange}
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                rows='5'
            />
            <Button
                varient='contained'
                onClick={handleSave}
                style={{
                    marginTop: '3vh', width: '17vw', height: '5vh', fontSize: '3vh',
                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#afbfbf'
                }}
            >Save</Button>
        </form>
    )
};

export default ProfileControl;