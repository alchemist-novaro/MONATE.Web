import { useState } from 'react';
import Header from '../components/header.jsx';
import { useLight } from '../globals/redux-store.jsx';
import { useEffect, useRef } from 'react';
import { useAlert } from '../components/alerts.jsx';
import { MyTextField } from '../components/my-controls.jsx';
import { UploadIcon, LinkIcon } from '../components/svg-icons.jsx';
import ItemPicker from '../components/item-picker.jsx';
import CryptionHelper from '../../helpers/cryption-helper.js';

import './portfolio.css';

const Portfolio = (props) => {
    const lightMode = useLight();
    const { showAlert } = useAlert();

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [url, setUrl] = useState('');
    const [urlError, setUrlError] = useState('');
    const [image, setImage] = useState('');
    const [imageError, setImageError] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([
        ['ComfyUI', 1],
        ['Stable Diffusion', 2],
        ['ComfyUI', 3],
        ['Stable Diffusion', 4],
        ['ComfyUI', 5],
        ['Stable Diffusion', 6],
        ['ComfyUI', 7],
        ['Stable Diffusion', 8],
        ['ComfyUI', 9],
        ['Stable Diffusion', 10],
    ]);

    const imageInputRef = useRef();

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }
    const onUrlchange = (e) => {
        setUrl(e.target.value);
    }

    const onUploadImage = () => {
        imageInputRef.current.click();
    }
    const onImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        const redirect = () => {
            window.location.href = '/';
        };
        const validateToken = async () => {
            const email = sessionStorage.getItem('email');
            const token = sessionStorage.getItem('token');
            if (email && token) {
                const cryptor = new CryptionHelper();
                await cryptor.initialize();
                const tokenData = {
                    email: await cryptor.encrypt(email.toLowerCase()),
                    token: await cryptor.encrypt(token),
                };
                try {
                    const response = await fetch(`user/getusertype`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(tokenData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                        redirect();
                    }
                    else {
                        const _userType = await cryptor.decrypt(data.userType);
                        if (_userType !== 'administrator') {
                            showAlert({ severity: 'error', message: 'You are not administrator.' });
                            redirect();
                        }
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                    redirect();
                }
            }
            else {
                showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
                redirect();
            }
        }
        validateToken();
    }, []);

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{
                display: 'flex', flexDirection: 'row', width: '100%', height: '100vh',
                backgroundColor: lightMode ? '#cfdfdf' : '#0f1f1f'
            }}>
                <div style={{
                    width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', marginLeft: '5vw'
                }}>
                    <div style={{
                        width: '80%', height: '80%', borderRadius: '10%', backgroundColor: '#ffffff22',
                        marginTop: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}>
                        <input
                            type='file'
                            accept="image/*"
                            onChange={onImageChange}
                            ref={imageInputRef}
                            style={{ display: 'none' }}
                        />
                        <div style={{
                            fontSize: '6vh', height: '10%', marginTop: '5%', color: lightMode ? '#1f2f2f' : '#dfefef', width: '100%',
                            display: 'flex', flexDirection: 'row',
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            Upload Portfolio
                        </div>
                        <MyTextField
                            required
                            name='Title'
                            error={titleError}
                            id='portfolio-title'
                            style={{ marginTop: '3%', width: '70%' }}
                            onChange={onTitleChange}
                        />
                        <MyTextField
                            required
                            name='Link'
                            error={urlError}
                            id='portfolio-link'
                            style={{ marginTop: '3%', width: '70%' }}
                            onChange={onUrlchange}
                        />
                        <ItemPicker
                            style={{ width: '68%', marginTop: '3%' }}
                            selectedItems={selectedCategories}
                            setSelectedItems={setSelectedCategories}
                            items={categories}
                            placeholder='Enter category here...'
                        />
                        <div style={{ cursor: 'pointer', }} onClick={onUploadImage}>
                            {image ?
                                <img src={image} alt='preview' style={{
                                    width: '28vw', height: '35vh', marginTop: '5%',
                                    borderRadius: '5%'
                                }} /> :
                                <div style={{
                                    width: '28vw', height: '35vh', marginTop: '5%',
                                    borderRadius: '5%', border: `1px solid ${imageError ? '#ff0000' : '#7f8f8f'}`, display: 'flex', flexDirection: 'row',
                                    justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <UploadIcon width='5vh' height='5vh' />
                                    <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '2.5vh', }}>
                                        &nbsp;Upload Image
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
                <div style={{ width: '40%' }}>
                    <div style={{
                        width: '80%', height: '47%', borderRadius: '10%', backgroundColor: '#ffffff22',
                        marginTop: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}>
                        {image ?
                            <img src={image} alt='preview' style={{
                                width: '70%', height: '27vh', marginTop: '5vh',
                                borderRadius: '5%'
                            }} /> :
                            <div style={{
                                width: '70%', height: '27vh', marginTop: '5vh',
                                borderRadius: '5%', border: `1px solid ${imageError ? '#ff0000' : '#7f8f8f'}`, display: 'flex', flexDirection: 'row',
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '2.5vh' }}>
                                    None
                                </div>
                            </div>}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }} >
                            <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '2.5vh', marginTop: '1vh', height: '2.7vh' }}>
                                {title}
                            </div>
                            <div style={{
                                color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '2vh', height: '2.5vh', marginTop: '1vh',
                                display: 'flex', flexDirection: 'row', alignItems: 'center'
                            }}>
                                <LinkIcon width='2.5vh' height='2.5vh' />&nbsp;{url}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Header />
        </div>
    );
}

export default Portfolio;