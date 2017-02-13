/**
 * Created by peter on 2/12/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';

const DateDetailComponent = ({selectedDate,dinnerclub}) => {
    // If this component is rendered, selectedDate is a valid date, and we can
    // safely use it to construct a date
    console.log("Month should be ISO string: "+selectedDate);
    const theDate = moment(selectedDate);
    if(dinnerclub){
        const shop_message = (dinnerclub.shopping_complete) ? 'Shopping has completed' : 'No shopping yet';
        // TODO participants table or something
        return (
            <div>
                <h3>{theDate.format("D MMMM YYYY")} at {moment(dinnerclub.at).format('k:mm')}</h3>
                <p>We are having {dinnerclub.meal} today!</p>
                <p>{shop_message}</p>
            </div>
        )
    } else {
        return (
            <div>
                <h3>{theDate.format("D MMMM YYYY")}</h3>
                <p>No dinnerclub today</p>
            </div>
        )
    }
};

DateDetailComponent.fragments = {
    dinnerclub: gql`
        fragment DayDetailComponentDinnerClub on DinnerClub {
            cancelled
            at
            meal
            shopping_complete
            cook {
                display_name
            }
            participants {
                cancelled
                user {
                    id
                    display_name
                }
            }
        }
    `
};

const mapStateToProps = (state) => ({
    selectedMonth: moment(state.calendar.selectedMonth),
    selectedDate: state.calendar.selectedDetailDate
});

export default connect(mapStateToProps)(DateDetailComponent);