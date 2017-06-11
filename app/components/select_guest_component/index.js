/**
 * Created by peter on 5/3/17.
 */

import React from 'react';
import { propType } from 'graphql-anywhere';
import { gql, graphql } from 'react-apollo';
//import gql from 'graphql-tag';
import update from 'immutability-helper';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import participateMutation from './participate.gql';

const SelectGuestComponent = ({disabled,dinnerclubID,participation,setGuestCount}) => {
    console.log("We have guests: "+participation.guest_count);
    let options = [0,1,2,3,4,5].map((n)=> ({value: n, label: n}) );
    return (
        <div>
            <h3>
                Antal gæster:&emsp;
                <Select
                    value={participation.guest_count}
                    options={options}
                    disabled={disabled}
                    onChange={(option)=>setGuestCount(dinnerclubID,participation.id,option.value)}/>
            </h3>
        </div>
    );
};
//<select value="0" onChange={something}>

SelectGuestComponent.fragments = {
    participation: gql`
        fragment SelectGuestComponentDinnerClubParticipation on DinnerClubParticipation {
            id
            guest_count
        }
    `
};

export const selectGuestCountMutation = participateMutation;
    /*gql`
    mutation participate($dinnerclubID: String!,$guest_nr: Int!){
        participate(id: $dinnerclubID,participating:{guest_count:$guest_nr}) {
            id
            guest_count
        }
    }
`*/;

SelectGuestComponent.defaultProps = {
    disabled: false
};

SelectGuestComponent.propTypes = {
    dinnerclubID: React.PropTypes.string.isRequired,
    participation: propType(SelectGuestComponent.fragments.participation).isRequired
};

export default graphql(selectGuestCountMutation,{
    props({ _,mutate }) {
        return {
            setGuestCount(dinnerclubID,participationID,guest_nr){
                console.log(dinnerclubID);
                console.log(guest_nr);
                return mutate({
                    variables: {
                        dinnerclubID: dinnerclubID,
                        guest_nr: guest_nr
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        participate: {
                            __typename: 'UserParticipation',
                            id: participationID,
                            guest_nr: guest_nr
                        }
                    },
                    updateQueries: {
                        calendarUserQuery: (previousResult, { mutationResult }) => {
                            const newParticipation = mutationResult.data.participate;
                            const newPartID = newParticipation.id;
                            const newGuestCount = newParticipation.guest_count;
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
                                                participants[updateParticipantsIndex].guest_count = newGuestCount;
                                            return l;
                                        }}
                                    }
                                }
                            });
                            return newResult;
                        }
                    }
                }).catch((err)=>console.log(err))
            }
        }
    }

})(SelectGuestComponent);

