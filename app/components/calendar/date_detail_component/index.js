/**
 * Created by peter on 2/12/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/lib/Table';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Col';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import moment from 'moment';
import LoadingIcon from '../../loading_icon';
import participationReducer, {participationFragment} from '../../../util/participation_reducer';
import MealEdit from '../../meal_edit';
import Switch from 'react-bootstrap-switch';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

const iconWidth = 6;

const tooltip = (name) => <Tooltip>{name}</Tooltip>;

const defaultImage = "http://www.worldji.com/img/profile_default.png";

const DateDetailComponent = ({data}) => {
    let {loading,error,me} = data;
    //console.log(me.kitchen.dinnerclub);
    if(loading){
        return <LoadingIcon message="Henter Madklub..."/>
    }
    var dinnerclub = me.kitchen.dinnerclub;
    // If this component is rendered, selectedDate is a valid date, and we can
    // safely use it to construct a date
    //console.log("Month should be ISO string: "+selectedDate);
    if(dinnerclub){
        // Determining currents users relation to the current dinnerclub
        let {isParticipating,participationID,hasCancelled} =
            participationReducer(dinnerclub.participants,me.id);
        let isCook = me.id === dinnerclub.cook.id;
        // Parsing dinnerclub data for presentation
        const theDate = moment(dinnerclub.at);
        const shop_message = (dinnerclub.shopping_complete) ? 'Der er købt ind' : 'Der er ikke købt ind';
        let shop_component = (isCook) ?
            <h3>
                Indkøb:&emsp;
                <Switch
                    value={dinnerclub.shopping_complete}
                    onColor="success"
                    onChange={(el,state)=>console.log('Gotta get that: '+state)}/>
            </h3> :
            <p>{shop_message}</p>;
        // Create cancel component for either cook or participant
        let cancelComponent = (isCook) ?
            <CookCancelDinnerclub/> :
            (isParticipating) ?
                <ParticipantCancelDinnerclub/> : <ParticipantParticipateDinnerclub/>;
        // Count nr of participants
        let participants = dinnerclub.participants;
        let nrParticipating = participants.reduce((acc,p)=>acc + ((p.cancelled) ? 0 : 1),0);
        // TODO grey out participants who has cancelled
        var participantIcons = participants.map((p) =>
            <Col key={p.id} xs={6} sm={4} md={3} lg={2}>
                <OverlayTrigger placement="top" overlay={tooltip(p.user.display_name)}>
                    <Image src={(p.user.picture) ? p.user.picture : defaultImage} circle responsive/>
                </OverlayTrigger>
            </Col>
        );
        let dinnerclubText = (dinnerclub.meal) ? 'Menu: '+dinnerclub.meal : 'Retten ikke besluttet endnu';
        let dinnerclubComponent = (isCook) ?
            <MealEdit
                dinnerClub={dinnerclub}/> : <p>{dinnerclubText}</p>;
        return (
            <div>
                <Grid>
                    <Row>
                        <h2>{theDate.format("D MMMM")} kl {theDate.format('k:mm')} <small>{theDate.format("YYYY")}</small></h2>
                    </Row>
                    <Row>
                        <h3>Kok: {dinnerclub.cook.display_name}</h3>
                    </Row>
                    <Row>
                        {dinnerclubComponent}
                    </Row>
                    <Row>
                        {shop_component}
                    </Row>
                    <Row>
                        <h3>Antal deltagere: {nrParticipating}</h3>
                    </Row>
                    <Row>
                        {participantIcons}
                    </Row>
                </Grid>
            </div>
        )
    } else {
        return (
            <div>
                <h3>No dinnerclub today</h3>
            </div>
        )
    }
};

DateDetailComponent.fragments = {
    dinnerclub: gql`
        fragment DateDetailComponentDinnerClub on DinnerClub {
            id
            cancelled
            at
            meal
            shopping_complete
            cook {
                id
                display_name
            }
            participants {
                ...isParticipatingDinnerClubParticipation
                id
                cancelled
                user {
                    id
                    display_name
                    picture
                }
            }
        }
        ${participationFragment}
    `
};

const dinnerclubWithIdQuery = gql`
    query dinnerclubWithIdQuery($dinnerclubID: ID!) {
        me {
            id
            kitchen {
                dinnerclub(id: $dinnerclubID) {
                    id
                    ...DateDetailComponentDinnerClub
                }
            }
        }
    }
    ${DateDetailComponent.fragments.dinnerclub}
`;

const mapStateToProps = (state) => ({
    selectedMonth: moment(state.calendar.selectedMonth),
    selectedDate: state.calendar.selectedDetailDate.date,
    selectedDinnerclubId: state.calendar.selectedDetailDate.dinnerclubId
});

export default connect(mapStateToProps)(
    graphql(dinnerclubWithIdQuery,{
        options: ({selectedDinnerclubId}) => {
            return {
                variables: {
                    dinnerclubID: selectedDinnerclubId
                }
            }
        }
    })
    (DateDetailComponent)
);