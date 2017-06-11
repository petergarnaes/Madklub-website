/**
 * Created by peter on 19-04-17.
 */
import React from 'react';
import { propType } from 'graphql-anywhere';
import { gql } from 'react-apollo';
//import gql from 'graphql-tag';
import update from 'immutability-helper';

export const cancelParticipationFragment = gql`
    fragment CancelParticipationComponentDinnerClub on DinnerClub {
        id
        at
        cancelled
        shopping_complete
    }
`;

export const cancelParticipateDinnerclubMutation = gql`
    mutation participate($dinnerclubID: String!,$cancel: Boolean!){
        participate(id: $dinnerclubID,participating:{cancelled:$cancel}) {
            id
            cancelled
        }
    }
`;

export var cancelParticipationPropTypes = {
    dinnerClub: propType(cancelParticipationFragment).isRequired,
    isParticipating: React.PropTypes.bool.isRequired,
    participationID: React.PropTypes.string,
    hasCancelled: React.PropTypes.bool.isRequired
}

const queryRoutine = (dinnerclubID) => (previousResult, { mutationResult }) => {
    const newParticipation = mutationResult.data.participate;
    const newPartID = newParticipation.id;
    const newCancel = newParticipation.cancelled;
    const updateDinnerclubIndex = previousResult.me.kitchen.
    dinnerclubs.findIndex((d)=>d.id === dinnerclubID);
    const updateParticipantsIndex = previousResult.me.kitchen.
        dinnerclubs[updateDinnerclubIndex].
    participants.findIndex((p) =>p.id === newPartID);
    let newResult = update(previousResult,{
        me: {
            kitchen: {
                dinnerclubs: {$apply: (l)=>{
                    l[updateDinnerclubIndex].
                        participants[updateParticipantsIndex].cancelled = newCancel;
                    return l;
                }}
            }
        }
    });
    return newResult;
};

export const cancelParticipateOptions = (queryName) => ({
    props({ _,mutate }) {
        return {
            setCancel(dinnerclubID,participationID,cancel){
                console.log(dinnerclubID);
                console.log(participationID);
                console.log(cancel);
                let updateQueriesObj = {};
                console.log('Cancelling with updated query: '+queryName);
                updateQueriesObj[queryName] = queryRoutine(dinnerclubID);
                return mutate({
                    variables: {
                        dinnerclubID: dinnerclubID,
                        cancel: cancel
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        participate: {
                            __typename: 'UserParticipation',
                            id: participationID,
                            cancelled: cancel
                        }
                    },
                    updateQueries: updateQueriesObj
                }).catch((err)=>console.log(err))
            }
        }
    }
});

