/**
 * Created by peter on 1/25/17.
 */
import {LOGIN,LOGOUT} from '../actions/login';

// Should never be used, as server render does provide an initial state for this, and client side rehydrates from server
// response
const initialState = false;

export default function isLoggedIn(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return true;
        case LOGOUT:
            return false;
        default:
            return state;
    }
}