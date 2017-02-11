/**
 * Created by peter on 2/11/17.
 */
import moment from 'moment';
import {SELECT_MONTH,SELECT_DETAIL_DATE} from '../actions/calendar';

// Selected detail date is 0 when unselected, selectedMonth is just a date, where
// we only use the month
const initialState = {selectedMonth: moment().toISOString(),selectedDetailDate: 0};

export default function calendar(state = initialState, action) {
    switch(action.type) {
        case SELECT_MONTH:
            const newState = {
                selectedMonth: action.date,
                selectedDetailDate: state.selectedDetailDate
            };
            return newState;
        case SELECT_DETAIL_DATE:
            const newState2 = {
                selectedMonth: state.selectedMonth,
                selectedDetailDate: action.day
            };
            return newState2;
        default:
            return state;
    }
}