/**
 * Created by peter on 1/25/17.
 */
import React from 'react';
import { Jumbotron, Grid,Button } from 'react-bootstrap';

const WelcomePage = () => (
    <Jumbotron>
        <Grid>
            <h1>Velkommen til "Er der Madklub i aften?"</h1>
            <p>
                For at se om der er madklub i aften, skal i logge ind. Så vil i være logget ind i 180 dage.
                Jeres bruger har email 10xx@test og kodeordet er værelsesnummeret.
            </p>
        </Grid>
    </Jumbotron>
);
/*
 <Button
 bsStyle="success"
 bsSize="large"
 href="http://react-bootstrap.github.io/components.html"
 target="_blank">
 View React Bootstrap Docs!
 </Button>
 */

export default WelcomePage