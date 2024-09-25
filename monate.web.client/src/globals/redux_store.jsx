import axios from 'axios';
import { createStore } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

// Action Types
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_LIGHT = 'SET_LIGHT';
export const SET_REGION = 'SET_REGION';
export const SET_USERNAME = 'SET_USERNAME';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_AVATAR = 'SET_AVATAR';

// Async function to get initial region information
export const initRegion = async () => {
    const response = await axios.get('https://ipinfo.io/json?token=c5118d2d404912');
    return response.data;
};

// Initial state
const initialState = {
    password: '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF',
    light: false,
    region: null,
    userName: null,
    email: null,
    avatar: null,
};

// Reducer function
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PASSWORD:
            return {
                ...state,
                password: action.payload,
            };
        case SET_LIGHT:
            return {
                ...state,
                light: action.payload,
            };
        case SET_REGION:
            return {
                ...state,
                region: action.payload,
            };
        case SET_USERNAME:
            return {
                ...state,
                userName: action.payload,
            };
        case SET_EMAIL:
            return {
                ...state,
                email: action.payload,
            }
        case SET_AVATAR:
            return {
                ...state,
                avatar: action.payload,
            }
        default:
            return state;
    }
};

// Action Creators
export const setPassword = (password) => ({
    type: SET_PASSWORD,
    payload: password,
});

export const setLight = (light) => ({
    type: SET_LIGHT,
    payload: light,
});

export const setRegion = (region) => ({
    type: SET_REGION,
    payload: region,
});

export const setUserName = (userName) => ({
    type: SET_USERNAME,
    payload: userName,
});

export const setEmail = (email) => ({
    type: SET_EMAIL,
    payload: email,
});

export const setAvatar = (avatar) => ({
    type: SET_USERNAME,
    payload: avatar,
});

// Custom Hooks for Saving Redux Values (in React components)
export const useSavePassword = () => {
    const dispatch = useDispatch();
    return (password) => dispatch(setPassword(password));
};

export const useSaveLight = () => {
    const dispatch = useDispatch();
    return (light) => dispatch(setLight(light));
};

export const useSaveRegion = () => {
    const dispatch = useDispatch();
    return (region) => dispatch(setRegion(region));
};

export const useSaveUserName = () => {
    const dispatch = useDispatch();
    return (userName) => dispatch(setUserName(userName));
}

export const useSaveEmail = () => {
    const dispatch = useDispatch();
    return (email) => dispatch(setEmail(email));
}

export const useSaveAvatar = () => {
    const dispatch = useDispatch();
    return (avatar) => dispatch(setAvatar(avatar));
}

// Custom Hooks for Getting Redux Values (in React components)
export const usePassword = () => {
    return useSelector((state) => state.password);
};

export const useLight = () => {
    return useSelector((state) => state.light);
};

export const useRegion = () => {
    return useSelector((state) => state.region);
};

export const useUserName = () => {
    return useSelector((state) => state.userName);
}

export const useEmail = () => {
    return useSelector((state) => state.email);
}

export const useAvatar = () => {
    return useSelector((state) => state.avatar);
}

// Create Redux Store
const store = createStore(reducer);

export default store;
