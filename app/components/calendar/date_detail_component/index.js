/**
 * Created by peter on 2/12/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import LoadingIcon from '../../loading_icon';

const DateDetailComponent = ({data}) => {
    let {loading,error,me} = data;
    //console.log(dinnerclub);
    if(loading){
        return <LoadingIcon message="Henter Madklub..."/>
    }
    var dinnerclub = me.kitchen.dinnerclub;
    // If this component is rendered, selectedDate is a valid date, and we can
    // safely use it to construct a date
    //console.log("Month should be ISO string: "+selectedDate);
    if(dinnerclub){
        const theDate = moment(dinnerclub.at);
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
                <h3>No dinnerclub today</h3>
            </div>
        )
    }
};

DateDetailComponent.fragments = {
    dinnerclub: gql`
        fragment DateDetailComponentDinnerClub on DinnerClub {
            id
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

const dinnerclubWithIdQuery = gql`
    query dinnerclubWithIdQuery($dinnerclubID: ID!) {
        me {
            kitchen {
                dinnerclub(id: $dinnerclubID) {
                    id
                    ...DateDetailComponentDinnerClub
                }
            }
        }
    }
    ${DateDetailComponent.fragments.dinnerclub}
`;

const mapStateToProps = (state) => ({
    selectedMonth: moment(state.calendar.selectedMonth),
    selectedDate: state.calendar.selectedDetailDate,
    selectedDinnerclubId: state.calendar.selectedDinnerclubId
});

export default connect(mapStateToProps)(
    graphql(dinnerclubWithIdQuery,{
        options: ({selectedDinnerclubId}) => {
            return {
                variables: {
                    dinnerclubID: selectedDinnerclubId
                }
            }
        }
    })
    (DateDetailComponent)
);