/**
 * Created by peter on 2/10/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Table from 'react-bootstrap/lib/Table';
import GlyphIcon from 'react-bootstrap/lib/Glyphicon.js';
import moment from 'moment';
import './styling.css';
import DayComponent from '../day_component';
import LoadingIcon from '../../loading_icon';

const CalendarComponent = ({data}) => {
    let {loading,error,me} = data;
    if(loading){
        return <LoadingIcon message="Loading data..."/>
    }

    // TODO handle error

    // Index dinnerclubs by date, if several on same day, the latest will be the winner...
    var dinnerclubMap = new Map();
    me.kitchen.dinnerclubs.forEach((d)=>{
        dinnerclubMap.set(moment(d.at).date(),d);
    });

    // Data loaded, we can initialize calendar
    let today = moment();
    let month = today.format("MMMM");
    let weeks = [];
    var index = moment(today).date(1).day(1);
    // Constructs all dates till the end of the month
    while(index.month() <= today.month()){
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
                        thisMonth={date.month() == today.month()} />
                )}
            </tr>
        )
    });
    return (
        <Table bordered condensed className="calendar-table">
            <thead>
            <tr>
                <th style={{textAlign: "center",cursor: "pointer"}}>
                    <GlyphIcon
                        glyph="chevron-left"/>
                </th>
                <th colSpan="6" style={{textAlign: "center"}}>{month}</th>
                <th style={{textAlign: "center",cursor: "pointer"}}>
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
    );
};

const currentUserQuery = gql`
    query currentUserQuery($todayStart: String!, $todayEnd: String!) {
        me {
            kitchen {
                dinnerclubs(range: {start: $todayStart,end: $todayEnd}) {
                    at
                    ...DayComponentDinnerClub
                }
            }
        }
    }
    ${DayComponent.fragments.dinnerclub}
`;

// TODO set range to entire month
let todayStart = moment().startOf('month').startOf('date').toISOString();
let todayEnd = moment().endOf('month').endOf('date').toISOString();
console.log("Calendar from "+todayStart+" To "+todayEnd);

export default graphql(currentUserQuery,{
    options: {
        variables: {
            todayStart: todayStart,
            todayEnd: todayEnd
        }
    }
})(CalendarComponent);