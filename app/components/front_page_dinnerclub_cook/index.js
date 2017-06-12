/**
 * Created by peter on 4/17/17.
 */

import React from 'react';
import { propType } from 'graphql-anywhere';
import moment from 'moment';
import '../front_page_dinnerclub/styling.css';
import MealComponent from '../meal_edit';
import ShoppingCompleteFrontPage from '../shopping_set/front_page';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import dinnerclubFragment from './DinnerClubFragment.gql';

const FrontPageCookComponent = ({dinnerClub}) => {
    const dinnerclub_date = moment(dinnerClub.at);
    return (
        <div className="front-page-dinnerclub-container">
            <h2>Madklub kl. {dinnerclub_date.format("H:mm")}</h2>
            <MealComponent
                dinnerClub={dinnerClub}/>
            <h3>Antal deltagere: {dinnerClub.participants.length}</h3>
            <p><b>Købt ind</b></p>
            <ShoppingCompleteFrontPage
                dinnerClub={dinnerClub}/>
        </div>
    )
};

FrontPageCookComponent.propTypes = {
    dinnerClub: propType(dinnerclubFragment).isRequired
};

export default FrontPageCookComponent;