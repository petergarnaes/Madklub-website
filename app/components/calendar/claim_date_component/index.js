/**
 * Created by peter on 2/19/17.
 */
import React from 'react';
import './styling.css';
import 'rc-time-picker/assets/index.css';
import gql from 'graphql-tag';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

class ClaimDateComponent extends React.Component {
    constructor(props){
        super(props);
        this.onClaim = this.onClaim.bind(this);
        this.onMealChange = this.onMealChange.bind(this);
        this.onMealTimeChange = this.onMealTimeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        // Time format is HH:mm:ss
        let times = this.props.kitchen.default_mealtime.split(":");
        this.state = {
            claimed: false,
            meal: '',
            mealtime: moment(this.props.date).set({'hour':times[0],'minute':times[1],'second':times[2]})
        }
    }

    onClaim(){
        this.setState({
            claimed: true
        });
    }
    onMealChange(e){
        let typed = e.target.value;
        this.setState({
            meal: typed
        })
    }

    onMealTimeChange(val){
        this.setState({
            mealtime: val
        })
    }

    onSubmit(){
        //TODO
    }


    componentWillReceiveProps(_){
        this.setState({
            claimed: false
        })
    }

    render() {
        if(!this.state.claimed){
            return (
                <Grid>
                    <Row>
                        <Button bsStyle="primary" onClick={this.onClaim} className="center-block">
                            Lav mad d. {this.state.mealtime.format("DD/MM")}
                        </Button>
                    </Row>
                </Grid>
            )
        }
        // Today at default meal time
        return (
            <Form horizontal>
                <FormGroup controlId="timeValidation" bsSize="small">
                <Col xsOffset={2} xs={10} smOffset={4} sm={8} lgOffset={3} lg={6}>
                    <h3><small>Madklub d. {moment(this.props.date).format("DD/MM")}</small></h3>
                </Col>
                </FormGroup>
                <FormGroup controlId="timeValidation">
                    <Col componentClass={ControlLabel} xs={2} sm={4} lg={3} className="create-dinnerclub-control-label">
                        <ControlLabel>Tidspunkt</ControlLabel>
                    </Col>
                    <Col xs={10} sm={8}>
                        <TimePicker
                            showSecond={false}
                            onChange={this.onMealTimeChange}
                            defaultValue={this.state.mealtime}/>
                    </Col>
                </FormGroup>
                <FormGroup controlId="mealValidation" bsSize="small">
                    <Col componentClass={ControlLabel} xs={2} sm={4} lg={3}>
                        <ControlLabel>
                            Måltid
                        </ControlLabel>
                    </Col>
                    <Col xs={10} sm={8} lg={6}>
                        <FormControl
                            name="meal"
                            label="meal"
                            type="text"
                            onChange={this.onMealChange}/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col xsOffset={2} xs={10} smOffset={4} sm={8} lgOffset={3} lg={6}>
                        <Button
                            onClick={this.onSubmit}
                            bsStyle="primary">
                            Opret madklub
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

ClaimDateComponent.propTypes = {
    kitchen: React.PropTypes.object
}

ClaimDateComponent.fragments = {
    kitchen: gql`
        fragment ClaimDateComponentKitchen on Kitchen {
            default_mealtime
        }
    `
};

export default ClaimDateComponent;