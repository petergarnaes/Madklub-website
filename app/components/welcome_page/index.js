/**
 * Created by peter on 1/25/17.
 */
import React from 'react';
import { Jumbotron, Grid,Button } from 'react-bootstrap';

const WelcomePage = () => (
    <Jumbotron>
        <Grid>
            <h1>Lets go!</h1>
            <p>
                <Button
                    bsStyle="success"
                    bsSize="large"
                    href="http://react-bootstrap.github.io/components.html"
                    target="_blank">
                    View React Bootstrap Docs!
                </Button>
            </p>
        </Grid>
    </Jumbotron>
);

export default WelcomePage