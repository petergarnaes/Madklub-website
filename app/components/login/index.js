import React from 'react';
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
)

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.state = {
            validate: null
        };
    }

    onEmailChange(e){
        console.log(e.target.value);
        let typed = e.target.value;
        let val = (typed.length > 0 ? 
            (typed.includes('@') ? 'success' : 'error') : 
            null
        );
        this.setState({
            validate: val
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
                                    validate={this.state.validate}
                                    placeholder="Enter email"/>
                                <FieldGroup
                                    id="loginPassword"
                                    type="password"
                                    label="Password"
                                    placeholder="Enter password"/>
                                <Button
                                    bsStyle="primary"
                                    bsSize="large"
                                    className="center-block"
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
