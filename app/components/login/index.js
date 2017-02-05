import React from 'react';
import withRouter from 'react-router-dom/withRouter';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
/*import {
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Button,
    Grid,
    Row,
    Col} from 'react-bootstrap';*/

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
    /*static propTypes = {
        router: React.PropTypes.object.isRequired,
        mutate: React.PropTypes.func.isRequired,
        login: React.PropTypes.func.isRequired,
    }*/

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
            console.log("Something is wrong with your login");
            e.preventDefault();
        }
    }

    render(){
        return (
                <form onSubmit={this.onSubmit} method="POST">
                    <Grid>
                        <Row>
                            <Col xs={0} sm={2} md={3} lg={4}/>
                            <Col xs={12} sm={8} md={6} lg={4}>
                                <FieldGroup
                                    id="loginEmail"
                                    type="email"
                                    name="username"
                                    label="Email"
                                    onChange={this.onEmailChange}
                                    validate={this.state.emailValidation}
                                    placeholder="Enter email"/>
                                <FieldGroup
                                    id="loginPassword"
                                    type="password"
                                    name="password"
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
                                    type="submit">
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

/* Old login, shows how to use mutations. The Reux connect stuff was to fire the login action to make redux store
   be correct, so Account and Main page and stuff shows
const loginMutation = gql`
    mutation login($username: String!,$password: String!){
        login(username: $username,password: $password) {
            success
            feedback
        }
    }
`;

const mapStateToProps = (_) => ({});

const mapDispatchToProps = (dispatch) => ({
    login: () => {
        dispatch(login())
    }
});
 export default connect(mapStateToProps,mapDispatchToProps)(graphql(loginMutation)(withRouter(LoginComponent)))
*/

export default withRouter(LoginComponent)