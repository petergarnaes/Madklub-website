/**
 * Created by peter on 2/11/17.
 */
import moment from 'moment';
import {
    SELECT_MONTH,
    SELECT_DETAIL_DATE,
    SELECT_DINNERCLUB_WITH_ID} from '../actions/calendar';

// Selected detail date is 0 when unselected, selectedMonth is just a date, where
// we only use the month
const initialState = {
    selectedMonth: moment().toISOString(),
    selectedDetailDate: {
        date: moment.invalid().toISOString(),
        dinnerclubId: ''
    }
};

export default function calendar(state = initialState, action = {}) {
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
                selectedDetailDate: {
                    date: action.date,
                    dinnerclubId: ''
                }
            };
            return newState2;
        case SELECT_DINNERCLUB_WITH_ID:
            const newState3 = {
                selectedMonth: state.selectedMonth,
                selectedDetailDate: {
                    date: moment.invalid().toISOString(),
                    dinnerclubId: action.dinnerclubId
                }
            };
            return newState3;
        default:
            return state;
    }
}