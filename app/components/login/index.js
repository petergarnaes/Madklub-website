import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Button,
    Grid,
    Row,
    Col} from 'react-bootstrap';

const FieldGroup = ({ id, label, validate, help, ...props }) => (
    <FormGroup controlId={id}
        validationState={validate}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {validate && <FormControl.Feedback />}
        {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
);

class LoginComponent extends React.Component {
    static propTypes = {
        //router: React.PropTypes.object.isRequired,
        mutate: React.PropTypes.func.isRequired,
    }

    constructor(props){
        super(props);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            email: '',
            emailValidation: null,
            passwordValidation: null,
            password: '',
            loginErrorHelp: null,
            loggingIn: false
        };
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

    onPasswordChange(e){
        let typed = e.target.value;
        let val = (typed.length > 0 ?
                (typed.length > 2 ? 'success' : 'warning') :
                null
        );
        this.setState({
            passwordValidation: val,
            password: typed
        });
    }

    onSubmit(e){
        console.log(e);
        if(!(this.state.password.length > 2 && this.state.email.includes('@'))){
            this.setState({
                emailValidation: 'warning',
                passwordValidation: 'warning',
                loginErrorHelp: 'Please make sure to use email and valid password of 6 characters or more'
            });
            return;
        }
        this.props.mutate({variables: {
            username: this.state.email,
            password: this.state.password
        }}).then((b)=>
            // TODO change return type to something with validation feedback AND redirect to '/'
            console.log(b)
        ).catch((err)=>{
            // TODO after above backend refactor, should report network error or something
            this.setState({
                emailValidation: 'error',
                passwordValidation: 'error',
                loginErrorHelp: 'Invalid login!'
            });
        });
    }

    render(){
        return (
                <form>
                    <Grid>
                        <Row>
                            <Col xs={0} sm={2} md={3} lg={4}/>
                            <Col xs={12} sm={8} md={6} lg={4}>
                                <FieldGroup
                                    id="loginEmail"
                                    type="email"
                                    label="Email"
                                    onChange={this.onEmailChange}
                                    validate={this.state.emailValidation}
                                    placeholder="Enter email"/>
                                <FieldGroup
                                    id="loginPassword"
                                    type="password"
                                    label="Password"
                                    onChange={this.onPasswordChange}
                                    validate={this.state.passwordValidation}
                                    help={this.state.loginErrorHelp}
                                    placeholder="Enter password"/>
                                <Button
                                    bsStyle="primary"
                                    bsSize="large"
                                    className="center-block"
                                    disabled={this.state.loggingIn}
                                    onClick={this.onSubmit}>
                                    Login
                                </Button>
                            </Col>
                            <Col xs={0} sm={2} md={3} lg={4}/>
                        </Row>
                    </Grid>
                </form>
        )
    }
}

const loginMutation = gql`
    mutation login($username: String!,$password: String!){
        login(username: $username,password: $password)
    }
`;

export default graphql(loginMutation)(LoginComponent)