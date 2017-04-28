/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import moment from 'moment';
import FrontPageDinnerClubComponent from '../front_page_dinnerclub';
import FrontPageCookComponent from '../front_page_dinnerclub_cook';
import LoadingIcon from '../loading_icon';
import participationReducer, {participationFragment} from '../../util/participation_reducer';

const TodayWithData = ({data}) => {
    let {loading,error,me} = data;
    console.log(me);
    if(loading){
        return (
            <LoadingIcon message="Loading..."/>
        )
    }
    // TODO error!
    if(error){
        console.log('Error!');
        console.log(error);
    }

    // DinnerClubs always ordered by 'at' date, so picking first will be the next one.
    let dinnerClubToday = me.kitchen.dinnerclubs[0];
    // TODO Make this look nicer
    if(!dinnerClubToday){
        return (
            <p>No Dinner club today peeps!</p>
        );
    }
    // Figures out if current user is the cook
    let isCook = me.id === dinnerClubToday.cook.id;
    console.log("Are we the cook today? "+isCook);
    if(isCook){
        return (
            <FrontPageCookComponent
                dinnerClub={dinnerClubToday}/>
        );
    } else {
        // Figuring out if current user participates
        let {isParticipating,participationID,hasCancelled} =
            participationReducer(dinnerClubToday.participants,me.id);
        return (
            <FrontPageDinnerClubComponent
                dinnerClub={dinnerClubToday}
                participationID={participationID}
                isParticipating={isParticipating}
                hasCancelled={hasCancelled}/>
        );
    }
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
                    ...FrontPageCookComponentDinnerClub
                    cook {
                        id
                    }
                    participants {
                        ...isParticipatingDinnerClubParticipation
                    }
                }
            }
        }
    }
    ${FrontPageDinnerClubComponent.fragments.dinnerclub}
    ${FrontPageCookComponent.fragments.dinnerclub}
    ${participationFragment}
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