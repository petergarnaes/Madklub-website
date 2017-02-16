/**
 * Created by peter on 2/11/17.
 */

export const SELECT_MONTH = "SELECT_MONTH";
export const SELECT_DINNERCLUB_WITH_ID = "SELECT_DINNERCLUB_WITH_ID";
export const SELECT_DETAIL_DATE = "SELECT_DETAIL_DATE";

export function selectMonth(date){
    return {
        type: SELECT_MONTH,
        date: date
    }
}

export function selectDetailDate(date){
    return {
        type: SELECT_DETAIL_DATE,
        date: date
    }
}

export function selectDinnerclubWithId(dinnerclubId){
    return {
        type: SELECT_DINNERCLUB_WITH_ID,
        dinnerclubId: dinnerclubId
    }
}