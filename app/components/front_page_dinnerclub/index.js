/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import {
    Grid,
    Row,
    Col} from 'react-bootstrap';
import moment from 'moment';
import CookComponent from '../cook_component';
import RoundIconButton from '../round_icon_button';

const FrontPageDinnerClubComponent = ({dinnerClub,isParticipating,hasCancelled}) => (
    <Grid>
        <Row><h2>Der er mad kl. {moment(dinnerClub.at).format("H:mm")}</h2></Row>
        <Row><h3>Vi skal have {dinnerClub.meal}!</h3></Row>
        <Row>
            <CookComponent
                cook={dinnerClub.cook}/>
        </Row>
        <Row>
            <p>Cancelled: {""+dinnerClub.cancelled}, shopping is: {""+dinnerClub.shopping_complete}</p>
        </Row>
        <Row>
            <RoundIconButton
                glyph="ok"
                onClick={()=>console.log("Totally clicked that shit!")}
                isActive={isParticipating && !hasCancelled}
                activeColor="#BDE4B9"
                activeColorIcon="white"/>
            <RoundIconButton
                glyph="remove"
                onClick={()=>console.log("Totally clicked that other shit!")}
                isActive={hasCancelled || !isParticipating}
                activeColor="#e4b9b9"
                activeColorIcon="white"/>
        </Row>
    </Grid>
);

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