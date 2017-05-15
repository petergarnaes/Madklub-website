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
//import gql from 'graphql-tag';
import { gql, graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

const FieldGroup = ({ id, label, validate, help, ...props }) => (
    <FormGroup controlId={id}
               validationState={validate}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {validate && <FormControl.Feedback />}
        {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
);

class UserSettings extends React.Component {

    constructor(props){
        super(props);
        // Bind change functions
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onDisplayNameChange = this.onDisplayNameChange.bind(this);
        this.onRoomNumberChange = this.onRoomNumberChange.bind(this);
        this.onSaveSettings = this.onSaveSettings.bind(this);

        // Initial state
        this.state = {
            display_name: '',
            room_number: '',
            email: '',
            active: false,
            emailValidation: null,
            newPasswordValidation: null,
            old_password: '',
            new_password: '',
            new_password_retype: '',
            errorMsg: null,
            success: false
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.me){
            let me = newProps.me;
            this.setState({
                display_name: me.display_name,
                room_number: me.room_number,
                email: me.account.email,
                active: me.active,
            });
        }
    }

    onEmailChange(e){
        let typed = e.target.value;
        let valid = typed.includes('@');
        let val = (typed.length > 0 ?
                (valid ? 'success' : 'warning') :
                null
        );
        this.setState({
            emailValidation: val,
            email: typed
        });
    }

    onDisplayNameChange(e){
        let typed = e.target.value;
        this.setState({
            display_name: typed
        });
    }

    onRoomNumberChange(e){
        let typed = e.target.value;
        this.setState({
            room_number: typed
        });
    }

    onNewPassword(newPassword,newPasswordRetype){
        let pVal = (newPassword.length > 0 || newPasswordRetype.length > 0) ?
            ((newPassword === newPasswordRetype) ? 'success' : 'warning') :
            null;
        this.setState({
            new_password: newPassword,
            new_password_retype: newPasswordRetype,
            newPasswordValidation: pVal
        });
    }

    onSaveSettings(){
        this.setState({errorMsg: null});
        console.log('Store changes');
        // Assumes that button is disabled when retyped new password is incorrect
        this.props.setUserSettings(
            this.state.display_name,
            this.state.room_number,
            this.state.active,
            this.state.email,
            this.state.old_password,
            this.state.new_password
        ).then((res)=>this.setState({success: true}))
            .catch((err)=>this.setState({errorMsg: err.message}));
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
            console.log(error);
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
                            id="userSettingsDisplayName"
                            type="text"
                            name="display_name"
                            label="Brugernavn"
                            onChange={this.onDisplayNameChange}
                            value={this.state.display_name} />
                        <FieldGroup
                            id="userSettingsPicture"
                            type="file"
                            name="picture"
                            label="Profil billede"
                            help="Profil billede af dig" />
                        <FieldGroup
                            id="userSettingsRoomNumber"
                            type="text"
                            name="room_number"
                            label="Værelses nummer"
                            onChange={this.onRoomNumberChange}
                            value={this.state.room_number} />
                        <Checkbox checked={this.state.active} onChange={(_)=>this.setState({active: !this.state.active})}>
                            Aktiv
                        </Checkbox>
                        <HelpBlock>Aktive medlemmer tilmeldes automatisk madklub hvis køkkenet kører med automatisk tilmelding</HelpBlock>
                        <FieldGroup
                            id="userSettingsEmail"
                            type="email"
                            name="email"
                            label="Email"
                            onChange={this.onEmailChange}
                            validate={this.state.emailValidation}
                            value={this.state.email} />
                        <FieldGroup
                            id="userSettingsPreviousPassword"
                            type="password"
                            name="previous_password"
                            label="Password"
                            onChange={(e)=>this.setState({old_password: e.target.value})}
                            value={this.state.old_password}
                            placeholder="Indtast gammelt kodeord" />
                        <FormGroup validationState={this.state.newPasswordValidation}>
                            <FieldGroup
                                id="userSettingsNewPassword"
                                type="password"
                                name="new_password"
                                label="Nyt Password"
                                onChange={(e)=>this.onNewPassword(e.target.value,this.state.new_password_retype)}
                                value={this.state.new_password}
                                placeholder="Nyt kodeord" />
                            <FieldGroup
                                id="userSettingsRetypeNewPassword"
                                type="password"
                                name="retype_new_password"
                                label="Genindtast nyt Password"
                                onChange={(e)=>this.onNewPassword(this.state.new_password,e.target.value)}
                                value={this.state.new_password_retype}
                                placeholder="Genindtast nyt kodeord" />
                            {this.state.newPasswordValidation && (this.state.newPasswordValidation === 'warning') &&
                                <HelpBlock>
                                    Indtast nyt kodeord to gange
                                </HelpBlock>
                            }
                        </FormGroup>
                        <Button
                            bsStyle="primary"
                            bsSize="large"
                            className="center-block"
                            disabled={(this.state.newPasswordValidation === 'warning')}
                            onClick={this.onSaveSettings}>
                            Bekræft
                        </Button>
                    </Col>
                    <Col xs={0} sm={2} md={3} lg={4}/>
                </Row>
            </Grid>
        )
    }
};

const userSettingsQuery = gql`
    query userSettingsQuery {
        me {
            id
            display_name
            room_number
            active
            account {
                email
            }
        }
    }
`;

const userSettingsMutation = gql`
    mutation userSettingsMutation($display_name: String,$room_number: String,$active: Boolean,$email: String,
        $change_password: ChangePasswordType) {
        changeUser(display_name: $display_name,room_number: $room_number,active: $active,
                account: {email: $email,change_password: $change_password}){
            id
            display_name
            room_number
            active
            account {
                email
            }
        }
    }
`;

export default compose(
    graphql(userSettingsQuery,{
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
    graphql(userSettingsMutation,{
        props({_,mutate}){
            return {
                setUserSettings(display_name,room_number,active,email,old_password,new_password){
                    var variables = {
                        display_name: display_name,
                        room_number: room_number,
                        active: active,
                        email: email,
                    };
                    if(old_password && new_password && old_password.length > 0 && new_password.length > 0){
                        variables.change_password = {
                            old_password: old_password,
                            new_password: new_password
                        }
                    }
                    return mutate({
                        variables: variables,
                        optimisticResponse: {
                            __typename: 'Mutation',
                            changeUser: {
                                __typename: 'User',
                                display_name: display_name,
                                room_number: room_number,
                                active: active,
                                account: {
                                    email: email
                                }
                            }
                        },
                        updateQueries: {
                            userSettingsQuery: (previousResult, { mutationResult }) => {
                                console.log("Cache update");
                                console.log(previousResult);
                                let newUser = mutationResult.data.changeUser;
                                const dn = newUser.display_name;
                                const rn = newUser.room_number;
                                const a = newUser.active;
                                const e = newUser.account.email;
                                let newResult = update(previousResult,{
                                    me: {
                                        display_name: {$set: dn},
                                        room_number: {$set: rn},
                                        active: {$set: a},
                                        account: {email: {$set: e}}
                                    }
                                });
                                return newResult;
                            }
                        }
                    })
                }
            }
        }
    })
)(UserSettings);
