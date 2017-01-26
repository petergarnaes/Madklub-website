import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import WelcomePage from '../welcome_page';

const MainWithUserData = ({data}) => {
    let {loading,error,me} = data;
    console.log(loading);
    console.log(error);
    console.log(me);
    if(loading){
        // TODO make a proper loading component
        return (
            <p>Loading...</p>
        )
    }
    return (
        <p>We have that {me.display_name} is logged in and they live in room {me.room_number}</p>
    );
};

MainWithUserData.propTypes = {
    data: React.PropTypes.shape({
        loading: React.PropTypes.bool,
        error: React.PropTypes.object,
        me: React.PropTypes.object,
    }).isRequired
};

const currentUserQuery = gql`
    query currentUserQuery {
        me {
            display_name
            room_number
        }
    }
`;

const LoggedInMain = graphql(currentUserQuery)(MainWithUserData);

const Main = ({loggedIn}) => {
    // We are logged in
    if(loggedIn){
        return (<LoggedInMain/>);
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
