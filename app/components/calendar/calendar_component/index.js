/**
 * Created by peter on 2/10/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Table from 'react-bootstrap/lib/Table';
import moment from 'moment';
import './styling.css';
import DayComponent from '../day_component';

const CalendarComponent = () => {
    console.log("the current user is: "+username);
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
                        thisMonth={date.month() == today.month()} />
                )}
            </tr>
        )
    });
    return (
        <Table bordered condensed className="calendar-table">
            <thead>
            <tr>
                <th colSpan="8" style={{textAlign: "center"}}>{month}</th>
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

export default CalendarComponent;