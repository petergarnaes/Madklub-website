/**
 * Created by peter on 4/18/17.
 */
//import gql from 'graphql-tag';
import { gql } from 'react-apollo';
import update from 'immutability-helper';

export const dinnerclubFragment = gql`
    fragment ShoppingCompleteComponentDinnerClub on DinnerClub {
        id
        cancelled
        shopping_complete
    }
`;
export const completeShoppingDinnerclubMutation = gql`
    mutation changeDinnerClub($dinnerclubID: ID!,$value: Boolean!){
        changeDinnerClub(id: $dinnerclubID,shopping_complete: $value){
            id
            shopping_complete
        }
    }
`;
export const completeShoppingOptions = {
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
};

