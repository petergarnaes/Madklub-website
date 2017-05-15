/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
//import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import { gql, graphql } from 'react-apollo';
import './styling.css';
import moment from 'moment';
import CookComponent from '../cook_component';
import CancelParticipationFrontPage from '../cancel_participation_component/front_page';

const FrontPageDinnerClubComponent = ({dinnerClub,isParticipating,participationID,hasCancelled}) => {
    const dinnerclub_date = moment(dinnerClub.at);
    // Its to late to cancel when dinnerclub has already been held REMEMBER TO VERIFY SERVER SIDE
    const to_late = dinnerclub_date.isBefore(moment());
    console.log("PLZ!!!!");
    console.log(dinnerClub.cook);
    return (
        <div className="front-page-dinnerclub-container">
            <h2>Der er mad kl. {dinnerclub_date.format("H:mm")}</h2>
            <h3>Vi skal have {dinnerClub.meal}!</h3>
            <CookComponent
                cook={dinnerClub.cook}/>
            <CancelParticipationFrontPage 
                dinnerClub={dinnerClub}
                isParticipating={isParticipating}
                participationID={participationID}
                hasCancelled={hasCancelled}/>
        </div>
    );
};

FrontPageDinnerClubComponent.fragments = {
    // Cook cannot be merged in under the dinnerclub component,
    // so must be separate.
    cook: gql`
        fragment FrontPageDinnerClubComponentCook on SimpleUser {
            id
            ...CookComponentSimpleUser
        }
        ${CookComponent.fragments.simpleUser}
    `,
    dinnerclub: gql`
        fragment FrontPageDinnerClubComponentDinnerClub on DinnerClub {
            id
            at
            meal
            ...CancelParticipationComponentDinnerClub
        }
        ${CancelParticipationFrontPage.fragments.dinnerclub}
    `
};

FrontPageDinnerClubComponent.propTypes = {
    dinnerClub: propType(FrontPageDinnerClubComponent.fragments.dinnerclub).isRequired,
    isParticipating: React.PropTypes.bool.isRequired,
    participationID: React.PropTypes.string,
    hasCancelled: React.PropTypes.bool.isRequired
};

export default FrontPageDinnerClubComponent;