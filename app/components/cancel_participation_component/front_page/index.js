/**
 * Created by peter on 19-04-17.
 */
import React from 'react';
import moment from 'moment';
import { graphql } from 'react-apollo';
import {
    cancelParticipationFragment,
    cancelParticipateDinnerclubMutation,
    cancelParticipationPropTypes,
    cancelParticipateOptions} from '../shared';
import RoundIconButton from '../../round_icon_button';

const CancelParticipationFrontPage = ({dinnerClub,isParticipating,participationID,hasCancelled,setCancel}) => {
    const dinnerclub_date = moment(dinnerClub.at);
    // Its to late to cancel when dinnerclub has already been held REMEMBER TO VERIFY SERVER SIDE
    const to_late = dinnerclub_date.isBefore(moment());
    return (
        <div>
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

CancelParticipationFrontPage.fragments = {
    dinnerclub: cancelParticipationFragment
};

CancelParticipationFrontPage.propTypes = cancelParticipationPropTypes;

export default graphql(cancelParticipateDinnerclubMutation,cancelParticipateOptions)(CancelParticipationFrontPage);


