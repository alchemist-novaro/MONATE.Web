import axios from 'axios';
import { createStore } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

// Action Types
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_LIGHT = 'SET_LIGHT';
export const SET_REGION = 'SET_REGION';

// Initial state of the 'env' variable
const initialState = {
    password: '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF',
    light: true,
    region: null
};

// Get initial region information
const initRegion = () => {
    const response = axios.get('https://ipinfo.io/json?token=c5118d2d404912');
    return response.data;
};

// Reducer function to handle 'env' updates
const reducer = (state = initialState, action) => {
    initialState.region = initRegion();
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
            }
        case SET_REGION:
            return {
                ...state,
                region: action.payload,
            }
        default:
            return state;
    }
};

// Set redux values
export const setPassword = (password) => {
    useDispatch({
        type: SET_PASSWORD,
        payload: password,
    });
};

export const setLight = (light) => {
    useDispatch({
        type: SET_LIGHT,
        payload: light,
    });
};

export const setRegion = (region) => {
    useDispatch({
        type: SET_REGION,
        payload: region,
    });
};

// Get redux values
export const getPassword = () => {
    return useSelector((state) => state.password);
}

export const getLight = () => {
    return useSelector((state) => state.light);
}

export const getRegion = () => {
    return useSelector((state) => state.region);
}

// Create storage
const store = createStore(reducer);

export default store;