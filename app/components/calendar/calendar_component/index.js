/**
 * Created by peter on 2/10/17.
 */
import React from 'react';
//import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/lib/Table';
import GlyphIcon from 'react-bootstrap/lib/Glyphicon.js';
import moment from 'moment';
import './styling.css';
import DayComponent from '../day_component';
import LoadingIcon from '../../loading_icon';
import { selectMonth } from '../../../actions/calendar';
import DateDetailComponent from '../date_detail_component';
import ClaimDateComponent from '../claim_date_component';
import calendarUserQuery from './calendarUserQuery.gql';

const CalendarComponent = ({data,selectedMonth,selectMonth,selectedDate,selectedDinnerclubID}) => {
    let {loading,error,me} = data;
    console.log("Bobby!");
    console.log(data);
    console.log(me);
    if(loading){
        return <LoadingIcon message="Loading data..."/>
    }
    //console.log(data);
    //console.log(me);

    // TODO handle error
    if(error){
        console.log('Error!');
        console.log(error);
    }

    // Index dinnerclubs by date, if several on same day, the latest will be the winner...
    /* TODO: move this into the reducer, so it does not have to be recalculated on every render.
        Reducer should make it possible to add one or several dinnerclubs. */
    var dinnerclubMap = new Map();
    me.kitchen.dinnerclubs.forEach((d)=>{
        dinnerclubMap.set(moment(d.at).date(),d);
    });

    // Data loaded, we can initialize calendar
    // TODO: this could also be moved into reducer, so only month changes
    // triggers these recalculations.
    let dateMonthSelection = selectedMonth.startOf('month');
    let month = dateMonthSelection.format("MMMM YY");
    let weeks = [];
    var index = moment(dateMonthSelection).date(1).day(1);
    // Constructs all dates till the end of the month
    // TODO: Use map?
    while(index.month() <= dateMonthSelection.month()){
        let week = index.week();
        var dates = [];
        while(index.week() == week){
            dates.push(moment(index));
            index.add(1,'days');
        }
        weeks.push({weekNr: week,dates: dates})
    }
    let rows = weeks.map((week)=>{
        return (
            <tr key={""+week.weekNr}>
                <td>{week.weekNr}</td>
                {week.dates.map((date) =>
                    <DayComponent
                        key={date.toISOString()}
                        date={date}
                        dinnerclub={dinnerclubMap.get(date.date())}
                        thisMonth={date.month() == dateMonthSelection.month()} />
                )}
            </tr>
        )
    });
    console.log("Do we have it? "+moment(selectedDate).isValid());
    // If a date is selected, ie. a valid date number
    var dateDetailComponent = (moment(selectedDate).isValid()) ?
        <ClaimDateComponent
            kitchen={me.kitchen}
            date={selectedDate}/> :
        (selectedDinnerclubID) ?
        <DateDetailComponent /> :
        null;
    return (
        <div>
            <Table bordered condensed className="calendar-table">
                <thead>
                <tr>
                    <th
                        style={{textAlign: "center",cursor: "pointer"}}
                        onClick={() => selectMonth(false,selectedMonth)}>
                        <GlyphIcon
                            glyph="chevron-left"/>
                    </th>
                    <th colSpan="6" style={{textAlign: "center"}}>{month}</th>
                    <th
                        style={{textAlign: "center",cursor: "pointer"}}
                        onClick={() => selectMonth(true,selectedMonth)}>
                        <GlyphIcon
                            glyph="chevron-right"/>
                    </th>
                </tr>
                <tr>
                    <th style={{textAlign: "center"}}>Uge #</th>
                    <th style={{textAlign: "center"}}>Mandag</th>
                    <th style={{textAlign: "center"}}>Tirsdag</th>
                    <th style={{textAlign: "center"}}>Onsdag</th>
                    <th style={{textAlign: "center"}}>Torsdag</th>
                    <th style={{textAlign: "center"}}>Fredag</th>
                    <th style={{textAlign: "center"}}>Lørdag</th>
                    <th style={{textAlign: "center"}}>Søndag</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row)=>row)}
                </tbody>
            </Table>
            {dateDetailComponent}
        </div>
    );
};

const mapStateToProps = (state) => ({
    selectedMonth: moment(state.calendar.selectedMonth),
    selectedDate: state.calendar.selectedDetailDate.date,
    selectedDinnerclubID: state.calendar.selectedDetailDate.dinnerclubId
});

const mapDispatchToProps = (dispatch) => ({
    selectMonth: (forwards,date) => {
        var dateCopy = moment(date);
        let newMonth = (forwards) ? dateCopy.add(1,'month') : dateCopy.subtract(1,'month');
        dispatch(selectMonth(newMonth.toISOString()))
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(
    graphql(calendarUserQuery,{
        options: ({selectedMonth}) => {
            // This is enough for the Apollo cache, as it will know if it has run this exact
            // query before, with these exact arguments.
            let todayStart = moment(selectedMonth).startOf('month').startOf('date').toISOString();
            let todayEnd = moment(selectedMonth).endOf('month').endOf('date').toISOString();
            console.log("Going from "+todayStart+" to "+todayEnd);
            return {
                variables: {
                    todayStart: todayStart,
                    todayEnd: todayEnd
                }
            }
        }
    })
    (CalendarComponent)
);