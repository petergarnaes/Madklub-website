/**
 * Created by peter on 4/18/17.
 */
import React from 'react';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import Switch from 'react-bootstrap-switch';
import {
    dinnerclubFragment,
    completeShoppingDinnerclubMutation,
    completeShoppingOptions} from '../shared';

const ShoppingCompleteDateDetail = ({dinnerClub,setShoppingComplete}) => (
    <h3>
        Indkøb:&emsp;
        <Switch
            value={dinnerClub.shopping_complete}
            onColor="success"
            disabled={dinnerClub.cancelled}
            onChange={(el,state)=>setShoppingComplete(dinnerClub.id,state)}/>
    </h3>
);

ShoppingCompleteDateDetail.fragments = {
    dinnerclub: dinnerclubFragment
};

ShoppingCompleteDateDetail.propTypes = {
    dinnerClub: propType(dinnerclubFragment).isRequired
};

export default graphql(completeShoppingDinnerclubMutation,completeShoppingOptions)(ShoppingCompleteDateDetail);
