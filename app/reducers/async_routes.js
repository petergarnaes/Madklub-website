/**
 * Created by peter on 2/7/17.
 */

import { REGISTER_ROUTE } from '../actions/async_routes';

const initialState = {};

export default function registeredRoutes(state = initialState, action) {
    switch (action.type) {
        case REGISTER_ROUTE:
            let key = action.key;
            var newState = Object.assign({},state);
            console.log(newState);
            newState[key] = true;
            return newState;
        default:
            return state;
    }
}