/**
 * Created by peter on 2/11/17.
 */
import React from 'react';
//import gql from 'graphql-tag';
import { gql } from 'react-apollo';
import './styling.css';
import moment from 'moment';
import { connect } from 'react-redux';
import { selectDetailDate,selectDinnerclubWithId } from '../../../actions/calendar';
import pure from 'recompose/pure';

// current user ID is at the top level of the query, maybe should be new Redux reducer? Then it could also include name
// so the users name could be displayed in top left.
const DayComponent = ({date,thisMonth,dinnerclub,userID,selectDetailDate,selectDinnerclub}) => {
    var className = (thisMonth) ? "calendar-date-cell" : "calendar-date-cell-inactive";
    var todayDot = "";
    let today = moment();
    if(date.date() == today.date() && date.month() == today.month()){
        todayDot += "todayDot";
    }
    var dinnerclubStatus = "#fff";
    var userStatus = "#fff";
    if(thisMonth && dinnerclub){
        dinnerclubStatus = (dinnerclub.cancelled) ? "red" : "green";
        userStatus = (dinnerclub.participants.reduce((b,p)=>(p.user.id === userID && !p.cancelled) || b,false)) ? "green" : "red";
    }
    return (
        <td
            onClick={
                () => {
                    if(dinnerclub){
                        selectDinnerclub(dinnerclub.id);
                    } else {
                        if(date.isSameOrAfter(today.startOf('date'))){
                            selectDetailDate(date)
                        }
                    }
                }
            }>
                <div className={className}>
                    <span style={{color: dinnerclubStatus,paddingRight: "0.5em"}}>&#11044;</span>
                    <span className={todayDot}>
                        {date.format("DD")}
                    </span>
                    <span style={{color: userStatus,paddingLeft: "0.5em"}}>&#9679;</span>
                </div>
        </td>
    )
};

// Make component pure for faster rendering
const PureDayComponent = pure(DayComponent);

PureDayComponent.propTypes = {
    date: React.PropTypes.object.isRequired,
    thisMonth: React.PropTypes.bool.isRequired,
    dinnerclub: React.PropTypes.object,
    userParticipating: React.PropTypes.bool
};

PureDayComponent.fragments = {
    dinnerclub: gql`
        fragment DayComponentDinnerClub on DinnerClub {
            id
            cancelled
            participants {
                id
                cancelled
                user {
                    id
                }
            }
        }
    `
};

const mapStateToProps = (state) => ({
    userID: state.currentUser.userID
});

const mapDispatchToProps = (dispatch) => ({
    selectDetailDate: (date) => dispatch(selectDetailDate(date.toISOString())),
    selectDinnerclub: (id) => dispatch(selectDinnerclubWithId(id))
});

export default connect(mapStateToProps,mapDispatchToProps)(PureDayComponent);