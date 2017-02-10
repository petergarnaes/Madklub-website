/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import './styling.css';
import moment from 'moment';
import CookComponent from '../cook_component';
import RoundIconButton from '../round_icon_button';

const FrontPageDinnerClubComponent = ({dinnerClub,isParticipating,hasCancelled}) => {
    console.log('Cancelled: '+dinnerClub.cancelled+' and shopping: '+dinnerClub.shopping_complete);
    const dinnerclub_date = moment(dinnerClub.at);
    // Its to late to cancel when dinnerclub has already been held REMEMBER TO VERIFY SERVER SIDE
    const to_late = dinnerclub_date.isBefore(moment());
    return (
        <div className="front-page-dinnerclub-container">
            <h2>Der er mad kl. {dinnerclub_date.format("H:mm")}</h2>
            <h3>Vi skal have {dinnerClub.meal}!</h3>
            <CookComponent
                cook={dinnerClub.cook}/>
            <RoundIconButton
                glyph="ok"
                onClick={()=>console.log("Totally clicked that shit! ")}
                isActive={isParticipating && !hasCancelled}
                activeColor="#1a591a"
                isDisabled={dinnerClub.shopping_complete || dinnerClub.cancelled || to_late}
                activeColorIcon="white"/>
            <RoundIconButton
                glyph="remove"
                onClick={()=>console.log("Totally clicked that other shit!")}
                isActive={hasCancelled || !isParticipating}
                isDisabled={dinnerClub.shopping_complete  || dinnerClub.cancelled || to_late}
                activeColor="#b73835"
                activeColorIcon="white"/>
        </div>
    );
};

FrontPageDinnerClubComponent.fragments = {
    dinnerclub: gql`
        fragment FrontPageDinnerClubComponentDinnerClub on DinnerClub {
            at
            cancelled
            shopping_complete
            meal
            cook {
                ...CookComponentSimpleUser
            }
        }
        ${CookComponent.fragments.simpleUser}
    `
};

FrontPageDinnerClubComponent.propTypes = {
    dinnerClub: propType(FrontPageDinnerClubComponent.fragments.dinnerclub).isRequired,
    isParticipating: React.PropTypes.bool.isRequired,
    hasCancelled: React.PropTypes.bool.isRequired
};

export default FrontPageDinnerClubComponent;