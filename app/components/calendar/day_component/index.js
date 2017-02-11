/**
 * Created by peter on 2/11/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import './styling.css';
import moment from 'moment';
import { connect } from 'react-redux';

// current user ID is at the top level of the query, maybe should be new Redux reducer? Then it could also include name
// so the users name could be displayed in top left.
const DayComponent = ({date,thisMonth,dinnerclub,userID}) => {
    var className = (thisMonth) ? "calendar-date-cell" : "calendar-date-cell-inactive";
    var innerClassName = "";
    let today = moment();
    if(date.date() == today.date() && date.month() == today.month()){
        innerClassName += "todayDot";
    }
    var dinnerclubStatus = "#fff";
    var userStatus = "#fff";
    // TODO remove false when dinnerclub object hooked up
    if(thisMonth && dinnerclub && false){
        dinnerclubStatus = (dinnerclub.cancelled) ? "red" : "green";
        userStatus = (userID === "lets compare to dinnerclub participants") ? "green" : "red";
    }
    return (
        <td
            className={className}
            onClick={
                () =>
                    console.log("BBB")
            }>
            <div className={innerClassName}>
                <span style={{color: dinnerclubStatus,paddingRight: "0.5em"}}>&#11044;</span>
                {date.format("DD")}
                <span style={{color: userStatus,paddingLeft: "0.5em"}}>&#9679;</span>
            </div>
        </td>
    )
};

DayComponent.propTypes = {
    date: React.PropTypes.object.isRequired,
    thisMonth: React.PropTypes.bool.isRequired,
    dinnerclub: React.PropTypes.object,
    userParticipating: React.PropTypes.bool
};

DayComponent.fragments = {
    dinnerClub: gql`
        fragment DayComponentDinnerClub on DinnerClub {
            cancelled
            participants {
                user {
                    id
                }
            }
        }
    `
};

const mapStateToProps = (state) => ({
    userID: state.currentUser.id
});

export default connect(mapStateToProps)(DayComponent);