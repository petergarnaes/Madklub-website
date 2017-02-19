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
        const theDate = moment(dinnerclub.at);
        const shop_message = (dinnerclub.shopping_complete) ? 'Der er købt ind' : 'Der er ikke købt ind';
        let participants = dinnerclub.participants;
        let nrParticipating = participants.reduce((acc,p)=>acc + ((p.cancelled) ? 0 : 1),0);
        var participantIcons = participants.map((p) =>
            <Col key={p.id} xs={6} sm={4} md={3} lg={2}>
                <OverlayTrigger placement="top" overlay={tooltip(p.user.display_name)}>
                    <Image src={(p.user.picture) ? p.user.picture : defaultImage} circle responsive/>
                </OverlayTrigger>
            </Col>
        );
        return (
            <div>
                <Grid>
                    <Row>
                        <h3>{theDate.format("D MMMM")} kl {theDate.format('k:mm')} <small>{theDate.format("YYYY")}</small></h3>
                    </Row>
                    <Row>
                        <p>Retten er {dinnerclub.meal}</p>
                    </Row>
                    <Row>
                        <p>{shop_message}</p>
                    </Row>
                    <Row>
                        <p>Antal deltagere: {nrParticipating}</p>
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
                id
                cancelled
                user {
                    id
                    display_name
                    picture
                }
            }
        }
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