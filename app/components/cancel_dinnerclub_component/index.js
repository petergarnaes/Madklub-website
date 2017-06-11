/**
 * Created by peter on 19-04-17.
 */
import React from 'react';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import moment from 'moment';
import update from 'immutability-helper';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import Switch from 'react-bootstrap-switch';
import dinnerClubFragment from './DinnerClubFragment.gql';
import cancelDinnerclubMutation from './cancelDinnerclubMutation.gql';

const CancelDinnerclubComponent = ({dinnerclub,setCancelDinnerclub}) => (
    <h3>
        Aflyst:&emsp;
        <Switch
            value={dinnerclub.cancelled}
            onColor="danger"
            onText="Aflyst"
            offText="Afholdes"
            disabled={moment(dinnerclub.at).isBefore(moment())}
            onChange={(el,state)=>setCancelDinnerclub(dinnerclub.id,state).catch((err)=>console.log(err))}/>
    </h3>
);

CancelDinnerclubComponent.fragments = {
    dinnerclub: dinnerClubFragment
};

CancelDinnerclubComponent.propTypes = {
    dinnerclub: propType(CancelDinnerclubComponent.fragments.dinnerclub).isRequired
};

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

