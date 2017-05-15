/**
 * Created by peter on 19-04-17.
 */
import React from 'react';
import { propType } from 'graphql-anywhere';
import { gql, graphql } from 'react-apollo';
//import gql from 'graphql-tag';
import update from 'immutability-helper';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import Switch from 'react-bootstrap-switch';

const CancelDinnerclubComponent = ({dinnerclub,setCancelDinnerclub}) => (
    <h3>
        Aflyst:&emsp;
        <Switch
            value={dinnerclub.cancelled}
            onColor="danger"
            onText="Aflyst"
            offText="Afholdes"
            onChange={(el,state)=>setCancelDinnerclub(dinnerclub.id,state).catch((err)=>console.log(err))}/>
    </h3>
);

CancelDinnerclubComponent.fragments = {
    dinnerclub: gql`
        fragment CancelDinnerclubComponentDinnerClub on DinnerClub {
            id
            cancelled
        }
    `
};

CancelDinnerclubComponent.propTypes = {
    dinnerclub: propType(CancelDinnerclubComponent.fragments.dinnerclub).isRequired
};

const cancelDinnerclubMutation = gql`
    mutation cancelDinnerclub($dinnerclubID: ID!, $cancel: Boolean!){
        changeDinnerClub(id: $dinnerclubID,cancelled: $cancel){
            id
            cancelled
        }
    }
`;

export default graphql(cancelDinnerclubMutation,{
    props({_,mutate}) {
        return {
            setCancelDinnerclub(dinnerclubID,cancel){
                return mutate({
                    variables: {
                        dinnerclubID: dinnerclubID,
                        cancel: cancel
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        changeDinnerClub: {
                            __typename: 'DinnerClub',
                            id: dinnerclubID,
                            cancelled: cancel
                        }
                    },
                    updateQueries: {
                        currentUserQuery: (previousResult, { mutationResult }) => {
                            const newDinnerclub = mutationResult.data.changeDinnerClub;
                            const newCancelled = newDinnerclub.cancelled;
                            const updateDinnerclubIndex = previousResult.me.kitchen.
                            dinnerclubs.findIndex((d)=>d.id === dinnerclubID);
                            let newResult = update(previousResult,{
                                me: {
                                    kitchen: {
                                        dinnerclubs: {
                                            $apply: (l)=>{
                                                l[updateDinnerclubIndex].cancelled = newCancelled;
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
})(CancelDinnerclubComponent);

