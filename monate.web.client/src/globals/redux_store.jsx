import axios from 'axios';
import { createStore } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

// Action Types
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_LIGHT = 'SET_LIGHT';
export const SET_REGION = 'SET_REGION';

// Async function to get initial region information
export const initRegion = async () => {
    const response = await axios.get('https://ipinfo.io/json?token=c5118d2d404912');
    return response.data;
};

// Initial state
const initialState = {
    password: '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF',
    light: true,
    region: null,
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

// Create Redux Store
const store = createStore(reducer);

export default store;
