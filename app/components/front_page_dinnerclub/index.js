/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import './styling.css';
import moment from 'moment';
import CookComponent from '../cook_component';
import RoundIconButton from '../round_icon_button';

const FrontPageDinnerClubComponent = ({dinnerClub,isParticipating,participationID,hasCancelled,setCancel}) => {
    console.log('Cancelled: '+dinnerClub.cancelled+' and shopping: '+dinnerClub.shopping_complete);
    const dinnerclub_date = moment(dinnerClub.at);
    // Its to late to cancel when dinnerclub has already been held REMEMBER TO VERIFY SERVER SIDE
    const to_late = dinnerclub_date.isBefore(moment());
    return (
        <div className="front-page-dinnerclub-container">
            <h2>Der er mad kl. {dinnerclub_date.format("H:mm")}</h2>
            <h3>Vi skal have {dinnerClub.meal}!</h3>
            <CookComponent
                cook={dinnerClub.cook}/>
            <RoundIconButton
                glyph="ok"
                onClick={
                    () => {
                        let participating = isParticipating && !hasCancelled;
                        console.log("We have that participating: "+participating);
                        if(!participating){
                            setCancel(dinnerClub.id,participationID,false);
                        }
                    }
                }
                isActive={isParticipating && !hasCancelled}
                activeColor="#1a591a"
                isDisabled={dinnerClub.shopping_complete || dinnerClub.cancelled || to_late}
                activeColorIcon="white"/>
            <RoundIconButton
                glyph="remove"
                onClick={
                    ()=> {
                        let participating = isParticipating && !hasCancelled;
                        console.log("We have that participating: "+participating);
                        if(participating){
                            setCancel(dinnerClub.id,participationID,true);
                        }
                    }
                }
                isActive={hasCancelled || !isParticipating}
                isDisabled={dinnerClub.shopping_complete  || dinnerClub.cancelled || to_late}
                activeColor="#b73835"
                activeColorIcon="white"/>
        </div>
    );
};

FrontPageDinnerClubComponent.fragments = {
    dinnerclub: gql`
        fragment FrontPageDinnerClubComponentDinnerClub on DinnerClub {
            id
            at
            cancelled
            shopping_complete
            meal
            cook {
                ...CookComponentSimpleUser
            }
        }
        ${CookComponent.fragments.simpleUser}
    `
};

const cancelParticipateDinnerclubMutation = gql`
    mutation participate($dinnerclubID: String!,$cancel: Boolean!){
        participate(id: $dinnerclubID,participating:{cancelled:$cancel}) {
            id
            cancelled
        }
    }
`;

FrontPageDinnerClubComponent.propTypes = {
    dinnerClub: propType(FrontPageDinnerClubComponent.fragments.dinnerclub).isRequired,
    isParticipating: React.PropTypes.bool.isRequired,
    participationID: React.PropTypes.string,
    hasCancelled: React.PropTypes.bool.isRequired
};

export default graphql(cancelParticipateDinnerclubMutation,{
    props({ _,mutate }) {
        return {
            setCancel(dinnerclubID,participationID,cancel){
                console.log(dinnerclubID);
                console.log(participationID);
                console.log(cancel);
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
                    updateQueries: {
                        currentUserQuery: (previousResult, { mutationResult }) => {
                            const newParticipation = mutationResult.data.participate;
                            const newPartID = newParticipation.id;
                            const newCancel = newParticipation.cancelled;
                            // TODO find better way to handle immutability
                            // Ugly but semi efficient deep clone
                            var newResult = (JSON.parse(JSON.stringify(previousResult)));
                            ((newResult.me.kitchen.dinnerclubs.filter((d)=>d.id === dinnerclubID)[0]).participants.filter((p) =>p.id === newPartID)[0]).cancelled = newCancel;
                            return newResult;
                        }
                    }
                })
            }
        }
    }
})(FrontPageDinnerClubComponent);