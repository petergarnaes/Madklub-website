/**
 * Created by peter on 2/12/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';

const DateDetailComponent = ({selectedMonth,selectedDate}) => {
    // If this component is rendered, selectedDate is a valid date, and we can
    // safely use it to construct a date
    console.log("Month should be ISO string: "+selectedMonth);
    const theDate = moment(selectedMonth).date(selectedDate);
    return (
        <div>
            <h3>{theDate.format("D MMMM YYYY")}</h3>
        </div>
    );
};

DateDetailComponent.fragments = {
    dinnerclub: gql`
        fragment DayDetailComponentDinnerClub on DinnerClub {
            cancelled
            participants {
                cancelled
                user {
                    id
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