/**
 * Created by peter on 19-04-17.
 */
import React from 'react';
import { propType } from 'graphql-anywhere';
import update from 'immutability-helper';
import cancelParticipationFragment from './DinnerClubFragment.gql';

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
                console.log("Cancelling dinnerclub"+dinnerclubID+" by setting it to "+cancel);
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
