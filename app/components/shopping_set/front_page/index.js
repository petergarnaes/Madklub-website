/**
 * Created by peter on 4/18/17.
 */
import React from 'react';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import RoundIconButton from '../../round_icon_button';
import { completeShoppingOptions } from '../shared';
import dinnerclubFragment from '../DinnerClubFragment.gql';
import completeShoppingDinnerclubMutation from '../completeShoppingDinnerclubMutation.gql';

const ShoppingCompleteFrontPage = ({dinnerClub,setShoppingComplete}) => (
    <div>
        <RoundIconButton
            glyph="ok"
            onClick={
                () => {
                    setShoppingComplete(dinnerClub.id,true);
                }
            }
            isActive={dinnerClub.shopping_complete}
            activeColor="#1a591a"
            isDisabled={dinnerClub.cancelled}
            activeColorIcon="white"/>
        <RoundIconButton
            glyph="remove"
            onClick={
                ()=> {
                    setShoppingComplete(dinnerClub.id,false);
                }
            }
            isActive={!dinnerClub.shopping_complete}
            isDisabled={dinnerClub.cancelled}
            activeColor="#b73835"
            activeColorIcon="white"/>
    </div>
);

ShoppingCompleteFrontPage.fragments = {
    dinnerclub: dinnerclubFragment
};

ShoppingCompleteFrontPage.propTypes = {
    dinnerClub: propType(dinnerclubFragment).isRequired
};

export default graphql(
    completeShoppingDinnerclubMutation,
    completeShoppingOptions('todayUserQuery'))
(ShoppingCompleteFrontPage);
