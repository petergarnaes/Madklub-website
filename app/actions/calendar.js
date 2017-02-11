/**
 * Created by peter on 2/11/17.
 */

export const SELECT_MONTH = "SELECT_MONTH";
export const SELECT_DETAIL_DATE = "SELECT_DETAIL_DATE";

export function selectMonth(date){
    return {
        type: SELECT_MONTH,
        date: date
    }
}

export function selectDetailDate(day){
    return {
        type: SELECT_DETAIL_DATE,
        day: day
    }
}