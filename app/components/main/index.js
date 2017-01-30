import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import WelcomePage from '../welcome_page';
import TodayPage from '../today';


const Main = ({loggedIn}) => {
    // We are logged in
    if(loggedIn){
        return (<TodayPage/>);
    } else {
        // No login, we serve the welcome page!
        return (<WelcomePage/>);
    }
};

let mapStateToProps = (state) => {
    return {
        loggedIn: state.isLoggedIn
    }
};

export default connect(mapStateToProps)(Main)
