/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import moment from 'moment';
import FrontPageDinnerClubComponent from '../front_page_dinnerclub';

const TodayWithData = ({data}) => {
    let {loading,error,me} = data;
    console.log(me);
    if(loading){
        return (
            <LoadingIcon message="Loading..."/>
        )
    }
    // TODO error!

    // DinnerClubs always ordered by 'at' date, so picking first will be the next one.
    let dinnerClubToday = me.kitchen.dinnerclubs[0];
    // TODO Make this look nicer
    if(!dinnerClubToday){
        return (
            <p>No Dinner club today peeps!</p>
        );
    }
    let {isParticipating,hasCancelled} = dinnerClubToday.participants.reduce(
        (pc,part) => {
            return ({
                isParticipating: pc.isParticipating || (part.user.id === me.id),
                hasCancelled: pc.hasCancelled || ((part.user.id === me.id) && part.cancelled)
            })
        },
        {isParticipating: false,hasCancelled: false}
    );
    return (
        <FrontPageDinnerClubComponent
            dinnerClub={dinnerClubToday}
            isParticipating={isParticipating}
            hasCancelled={hasCancelled}/>
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
            kitchen {
                dinnerclubs(range: {start: $todayStart,end: $todayEnd}) {
                    ...FrontPageDinnerClubComponentDinnerClub
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
    ${FrontPageDinnerClubComponent.fragments.dinnerclub}
`;

// Queries all of today (midnight to midnight), so we can pick the first upcoming one.
// millisecond set, so client AND server side construct the same query, therefore NOT refetching
// TODO not relevant for Madklub, but maybe set timezone in Redux, so we can set it here and ensure the same query happens on both client/server
// TODO maybe query from this moment forward instead? Let server Redux set the time?
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