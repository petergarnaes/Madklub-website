/**
 * Created by peter on 5/5/17.
 */
import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Alert from 'react-bootstrap/lib/Alert';
import LoadingIcon from '../loading_icon';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import adminSettingsQuery from './adminSettingsQuery.gql';
import adminSettingsMutation from './adminSettingsMutation.gql';

const FieldGroup = ({ id, label, validate, help, ...props }) => (
    <FormGroup controlId={id}
               validationState={validate}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {validate && <FormControl.Feedback />}
        {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
);

const cancellationDeadlineHelp = "Du skal indtaste et tal, som er det mindste antal af minutter inden madklubben " +
    "man kan aflyse. Hvis 0 gælder der ingen regel";
const shoppingOpenAtHelp = "Dus skal indtaste et tal, som er antallet af minutter inden afholdelsen af " +
    "madklubben, der angiver tidspunktet det tidligst er tilladt at købe ind. Hvis 0 så er gælder der ingen regel.";
const priceloftHelp = "Du skal indtaste et tal, som er den maksimale pris per person det må koste";

class AdminSettings extends React.Component {

    constructor(props){
        super(props);
        // Bind change functions
        this.onDefaultMealTimeChange = this.onDefaultMealTimeChange.bind(this);
        this.onCancellationDeadlineChange = this.onCancellationDeadlineChange.bind(this);
        this.onShoppingOpenAtChange = this.onShoppingOpenAtChange.bind(this);
        this.onDefaultPriceloftChange = this.onDefaultPriceloftChange.bind(this);
        this.onSaveSettings = this.onSaveSettings.bind(this);

        // Initial state
        this.state = {
            default_mealtime: moment(),
            rule_set: '',
            cancellation_deadline: '',
            shopping_open_at: '',
            priceloft_applies: false,
            default_priceloft: '',
            assume_attendance: false,
            name: '',

            cancellationDeadlineValidation: null,
            cancellationDeadlineHelp: null,
            shoppingOpenAtValidation: null,
            shoppingOpenAtHelp: null,
            defaultPriceloftValidation: null,
            defaultPriceloftHelp: null,
            
            errorMsg: null,
            success: false,
            submitting: false
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.me && newProps.me.kitchen){
            let kitchen = newProps.me.kitchen;
            let times = kitchen.default_mealtime.toString().split(":");
            this.setState({
                default_mealtime: moment().set({'hour':times[0],'minute':times[1],'second':times[2]}),
                rule_set: kitchen.rule_set,
                cancellation_deadline: kitchen.cancellation_deadline,
                shopping_open_at: kitchen.shopping_open_at,
                priceloft_applies: kitchen.priceloft_applies,
                default_priceloft: kitchen.default_priceloft,
                assume_attendance: kitchen.assume_attendance,
                name: kitchen.name,
            });
        }
    }
    
    static isFloat(val){
        var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
        if (!floatRegex.test(val))
            return false;

        val = parseFloat(val);
        if (isNaN(val))
            return false;
        return true;
    }
    
    static isInteger(val){
        return !isNaN(val);
    }

    onDefaultMealTimeChange(val){
        this.setState({
            default_mealtime: val
        })
    }
    
    onCancellationDeadlineChange(e){
        let cancellation_deadline = e.target.value;
        let isValid = (AdminSettings.isInteger(cancellation_deadline));
        let validate = (isValid) ? null : 'warning';
        let help = (isValid) ? null : cancellationDeadlineHelp;
        this.setState({
            cancellation_deadline: cancellation_deadline,
            cancellationDeadlineValidation: validate,
            cancellationDeadlineHelp: help
        });
    }
    
    onShoppingOpenAtChange(e){
        let shopping_open_at = e.target.value;
        let isValid = (AdminSettings.isInteger(shopping_open_at));
        let validate = (isValid) ? null : 'warning';
        let help = (isValid) ? null : shoppingOpenAtHelp;
        this.setState({
            shopping_open_at: shopping_open_at,
            shoppingOpenAtValidation: validate,
            shoppingOpenAtHelp: help
        });
    }
    
    onDefaultPriceloftChange(e){
        let default_priceloft = e.target.value;
        let isValid = (AdminSettings.isFloat(default_priceloft));
        let validate = (isValid) ? null : 'warning';
        let help = (isValid) ? null : priceloftHelp;
        this.setState({
            default_priceloft: default_priceloft,
            defaultPriceloftValidation: validate,
            defaultPriceloftHelp: help
        });
    }

    onSaveSettings(){
        this.setState({errorMsg: null,submitting: true});
        // Assumes that button is disabled when retyped new password is incorrect
        this.props.setAdminSettings(
            this.props.me.kitchen.id,
            this.state.rule_set,
            this.state.default_mealtime,
            this.state.cancellation_deadline,
            this.state.shopping_open_at,
            this.state.priceloft_applies,
            this.state.default_priceloft,
            this.state.assume_attendance,
            this.state.name
        ).then((res)=>this.setState({success: true,submitting: false}))
            .catch((err)=>this.setState({errorMsg: err.message,submitting: false}));
    }

    render(){
        if(this.props.loading){
            return (
                <LoadingIcon message="Loading..."/>
            )
        }
        // TODO error!
        if(this.props.error){
            console.log('Error!');
            console.log(this.props.error);
        }
        return (
            <Grid>
                <Row>
                    <Col xs={0} sm={2} md={3} lg={4}/>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        {this.state.success &&
                        <Alert bsStyle="success">
                            <h4>Success!</h4>
                            Dine ændringer gik i igennem
                        </Alert>}
                        {(this.state.errorMsg || this.props.error) &&
                        <Alert bsStyle="danger">
                            <h4>Fejl!</h4>
                            {this.state.errorMsg && <p>{this.state.errorMsg}</p>}
                            {this.props.error && <p>{this.props.error.message}</p>}
                        </Alert>}
                        <FieldGroup
                            id="adminSettingsPicture"
                            type="file"
                            name="picture"
                            label="Køkken billede"
                            help="Billede af køkken" />
                        <FieldGroup
                            id="adminSettingsRuleSet"
                            type="text"
                            name="rule_set"
                            label="Regel sæt"
                            componentClass="textarea"
                            placeholder="Hvilke regler har i på køkkenet?"
                            onChange={(e)=>this.setState({rule_set: e.target.value})}
                            value={this.state.rule_set} />
                        <FormGroup>
                            <ControlLabel>Automatisk Madklubs tidspunkt</ControlLabel>
                            <TimePicker
                                showSecond={false}
                                onChange={this.onDefaultMealTimeChange}
                                value={this.state.default_mealtime}
                                defaultValue={this.state.default_mealtime}/>
                        </FormGroup>
                        <FieldGroup
                            id="adminSettingsCancellatingDeadline"
                            type="text"
                            name="cancellation_deadline"
                            label="Aflysnings deadline"
                            onChange={this.onCancellationDeadlineChange}
                            validate={this.state.cancellationDeadlineValidation}
                            help={this.state.cancellationDeadlineHelp}
                            value={this.state.cancellation_deadline} />
                        <FieldGroup
                            id="adminSettingsShoppingOpenAt"
                            type="text"
                            name="shopping_open_at"
                            label="Indkøb tidligst åben"
                            onChange={this.onShoppingOpenAtChange}
                            validate={this.state.shoppingOpenAtValidation}
                            help={this.state.shoppingOpenAtHelp}
                            value={this.state.shopping_open_at} />
                        <Checkbox checked={this.state.priceloft_applies} onChange={(_)=>this.setState({priceloft_applies: !this.state.priceloft_applies})}>
                            Prisloft aktiv
                        </Checkbox>
                        <HelpBlock>Hvis ikke aktiv, kan en madklub koste så meget det skulle være</HelpBlock>
                        <FieldGroup
                            id="adminSettingsDefaultPriceloft"
                            type="text"
                            name="default_priceloft"
                            label="Prisloft"
                            onChange={this.onDefaultPriceloftChange}
                            validate={this.state.defaultPriceloftValidation}
                            help={this.state.defaultPriceloftHelp}
                            value={this.state.default_priceloft} />
                        <Checkbox checked={this.state.assume_attendance} onChange={(_)=>this.setState({assume_attendance: !this.state.assume_attendance})}>
                            Automatisk tilmelding af madklub
                        </Checkbox>
                        <HelpBlock>Hvis medlemmer er aktive, tilmeldes de automatisk ny-oprettede madklubber</HelpBlock>
                        <FieldGroup
                            id="adminSettingsName"
                            type="text"
                            name="kitchen_name"
                            label="Køkkenets navn"
                            onChange={(e)=>this.setState({name: e.target.value})}
                            value={this.state.name}/>
                        <Button
                            bsStyle="primary"
                            bsSize="large"
                            className="center-block"
                            disabled={(this.state.cancellationDeadlineValidation === 'warning') || 
                            (this.state.defaultPriceloftValidation === 'warning') || 
                            (this.state.shoppingOpenAtValidation === 'warning') || 
                            this.state.submitting}
                            onClick={this.onSaveSettings}>
                            {(this.state.submitting) ? 'Bekræfter...' : 'Bekræft'}
                        </Button>
                    </Col>
                    <Col xs={0} sm={2} md={3} lg={4}/>
                </Row>
            </Grid>
        )
    }
};

export default compose(
    graphql(adminSettingsQuery,{
        props: ({ data }) => {
            // loading state
            if (data.loading) {
                return { loading: true };
            }

            // error state
            if (data.error) {
                //console.error(data.error);
                return { error: data.error };
            }

            // OK state
            return { me: data.me };
        }
    }),
    graphql(adminSettingsMutation,{
        props({_,mutate}){
            return {
                setAdminSettings(kitchenId,rule_set,default_mealtime,cancellation_deadline,shopping_open_at,
                                 priceloft_applies,default_priceloft,assume_attendance,name){
                    var mealtime = default_mealtime.format("HH:mm:ss");
                    var variables = {
                        rule_set,
                        default_mealtime: mealtime,
                        cancellation_deadline,
                        shopping_open_at,
                        priceloft_applies,
                        default_priceloft,
                        assume_attendance,
                        name
                    };
                    return mutate({
                        variables: variables,
                        optimisticResponse: {
                            __typename: 'Mutation',
                            changeKitchen: {
                                __typename: 'Kitchen',
                                id: kitchenId,
                                rule_set,
                                default_mealtime: mealtime,
                                cancellation_deadline,
                                shopping_open_at,
                                priceloft_applies,
                                default_priceloft,
                                assume_attendance,
                                name
                            }
                        },
                        updateQueries: {
                            adminSettingsQuery: (previousResult, { mutationResult }) => {
                                let newKitchen = mutationResult.data.changeKitchen;
                                return update(previousResult,{
                                    me: {
                                        kitchen: {
                                            rule_set: {$set: newKitchen.rule_set},
                                            default_mealtime: {$set: newKitchen.default_mealtime},
                                            cancellation_deadline: {$set: newKitchen.cancellation_deadline},
                                            shopping_open_at: {$set: newKitchen.shopping_open_at},
                                            priceloft_applies: {$set: newKitchen.priceloft_applies},
                                            default_priceloft: {$set: newKitchen.default_priceloft},
                                            assume_attendance: {$set: newKitchen.assume_attendance},
                                            name: {$set: newKitchen.name}
                                        }
                                    }
                                });
                            }
                        }
                    })
                }
            }
        }
    })
)(AdminSettings);
