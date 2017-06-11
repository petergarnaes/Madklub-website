/**
 * Created by peter on 19-04-17.
 */

import React from 'react';
import moment from 'moment';
import { graphql } from 'react-apollo';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import Switch from 'react-bootstrap-switch';
import {
    cancelParticipationPropTypes,
    cancelParticipateOptions} from '../shared';
import cancelParticipateDinnerclubMutation from '../cancelParticipateDinnerclubMutation.gql';
import cancelParticipationFragment from '../DinnerClubFragment.gql';

const CancelParticipationDateDetail = ({dinnerClub,isParticipating,participationID,hasCancelled,setCancel}) => {
    const dinnerclub_date = moment(dinnerClub.at);
    // Its to late to cancel when dinnerclub has already been held REMEMBER TO VERIFY SERVER SIDE
    const to_late = dinnerclub_date.isBefore(moment());
    return (
        <div>
            <h3>
                Deltagelse:&emsp;
                <Switch
                    value={!hasCancelled}
                    onColor="success"
                    onText="Deltager"
                    offText="Frameldt"
                    disabled={dinnerClub.shopping_complete || dinnerClub.cancelled || to_late}
                    onChange={(el,state)=>setCancel(dinnerClub.id,participationID,!state)}/>
            </h3>
        </div>
    );
};

CancelParticipationDateDetail.fragments = {
    dinnerclub: cancelParticipationFragment
};

CancelParticipationDateDetail.propTypes = cancelParticipationPropTypes;

export default graphql(
    cancelParticipateDinnerclubMutation,
    cancelParticipateOptions('calendarUserQuery')
)(CancelParticipationDateDetail);

