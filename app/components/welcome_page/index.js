/**
 * Created by peter on 1/25/17.
 */
import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Grid from 'react-bootstrap/lib/Grid';
import LoadingIcon from '../loading_icon';
import pure from 'recompose/pure';

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

const PureWelcomePage = pure(WelcomePage);

export default PureWelcomePage