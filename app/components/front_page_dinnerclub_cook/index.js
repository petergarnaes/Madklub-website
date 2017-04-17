/**
 * Created by peter on 4/17/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import moment from 'moment';
import RoundIconButton from '../round_icon_button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

const FrontPageCookComponent = ({dinnerClub,setShoppingComplete}) => {
    const dinnerclub_date = moment(dinnerClub.at);
    return (
        <div>
            <h2>Madklub kl. {dinnerclub_date.format("H:mm")}</h2>
            <h3>
                Menu: {dinnerClub.meal} <Button bsStyle="primary"><Glyphicon glyph="pencil"/></Button>
            </h3>
            <h3>Deltagere: {dinnerClub.participants.length}</h3>
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
    )
};

FrontPageCookComponent.fragments = {
    dinnerclub: gql`
        fragment FrontPageCookComponentDinnerClub on DinnerClub {
            id
            at
            cancelled
            shopping_complete
            meal
            participants {
                id
            }
        }
    `
};

const completeShoppingDinnerclubMutation = gql`
    mutation changeDinnerClub($dinnerclubID: ID!,$value: Boolean!){
        changeDinnerClub(id: $dinnerclubID,shopping_complete: $value){
            id
            shopping_complete
        }
    }
`;

FrontPageCookComponent.propTypes = {
    dinnerClub: propType(FrontPageCookComponent.fragments.dinnerclub).isRequired
};

export default graphql(completeShoppingDinnerclubMutation,{
    props({_,mutate}) {
        return {
            setShoppingComplete(dinnerclubID,value){
                return mutate({
                    variables: {
                        dinnerclubID: dinnerclubID,
                        value: value
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        changeDinnerClub: {
                            __typename: 'DinnerClub',
                            id: dinnerclubID,
                            shopping_complete: value
                        }
                    },
                    updateQueries: {
                        currentUserQuery: (previousResult, { mutationResult }) => {
                            console.log("Bobby");
                            console.log(mutationResult.data);
                            const newDinnerclub = mutationResult.data.changeDinnerClub;
                            const newDinID = newDinnerclub.id;
                            const newShoppingComplete = newDinnerclub.shopping_complete;
                            const updateDinnerclubIndex = previousResult.me.kitchen.
                                dinnerclubs.findIndex((d)=>d.id === dinnerclubID);
                            let newResult = update(previousResult,{
                                me: {
                                    kitchen: {
                                        dinnerclubs: {
                                            $apply: (l)=>{
                                                l[updateDinnerclubIndex].shopping_complete = newShoppingComplete;
                                                return l;
                                            }
                                        }
                                    }
                                }
                            });
                            return newResult;
                        }
                    }
                })
            }
        }
    }
})(FrontPageCookComponent);