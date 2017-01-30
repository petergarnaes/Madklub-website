/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import moment from 'moment';
//import { connect } from 'react-redux';

const TodayWithData = ({data}) => {
    let {loading,error,me} = data;
    console.log(me);
    if(loading){
        // TODO make a proper loading component
        return (
            <p>Loading...</p>
        )
    }
    // TODO error!
    let todaysDinnerclub = me.kitchen.dinnerclubs[0];
    let {isParticipating,hasCancelled} = todaysDinnerclub.participants.reduce(
        ({is,has},part) =>
            ({
                isParticipating: is || (part.user.id == me.id),
                hasCancelled: (part.user.id == me.id) && part.cancelled
            }),
        {isParticipating: false,hasCancelled: false}
    );
    console.log("Do i participate? "+(isParticipating));
    console.log("Have i cancelled? "+(hasCancelled));
    return (
        <p>We have that {me.display_name} is logged in and they live in room {me.room_number}</p>
    );
};

TodayWithData.propTypes = {
    data: React.PropTypes.shape({
        loading: React.PropTypes.bool,
        error: React.PropTypes.object,
        me: React.PropTypes.object,
    }).isRequired
};

// We pick all participants, so we can check if our own ID is in the participants list of the dinnerclub we want to
// show. This gives some client side calculation, but this list is not to long. Maybe some Redux magic?
const currentUserQuery = gql`
    query currentUserQuery($todayStart: String!, $todayEnd: String!) {
        me {
            id
            display_name
            room_number
            kitchen {
                dinnerclubs(range: {start: $todayStart,end: $todayEnd}) {
                    participants {
                        cancelled
                        user {
                            id
                        }
                    }
                }
            }
        }
    }
`;

// Queries all of today (midnight to midnight), so we can pick the first upcoming one.
// millisecond set, so client AND server side construct the same query, therefore NOT refetching
// TODO not relevant for Madklub, but maybe set timezone in Redux, so we can set it here and ensure the same query happens on both client/server
// TODO maybe query from this moment forward instead?
let todayStart = moment().set({'hour':0,'minute':0,'second':0,'millisecond':0}).toISOString();
let todayEnd = moment().set({'hour':23,'minute':59,'second':59,'millisecond':0}).toISOString();
console.log("From "+todayStart+" To "+todayEnd);

const TodayPage = graphql(currentUserQuery,{
    options: {
        variables: {
            todayStart: todayStart,
            todayEnd: todayEnd
        }
    }
})(TodayWithData);

export default TodayPage;