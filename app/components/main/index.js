import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import WelcomePage from '../welcome_page';

const Main = ({router,data}) => {
    let {loading,error,me} = data;
    console.log(loading);
    console.log(error);
    console.log(me);
    // If we logged in and get redirected to here, we need to refresh. Using query parameters is slightly ugly,
    // but stateless!
    //if(router.location.query.refresh){
    //    data.refetch();
    //    router.replace('/');
    //}
    if(loading){
        // TODO make a proper loading component
        return (
            <p>Loading...</p>
        )
    }
    // We are logged in
    if(me){
        return (<p>We have that {me.display_name} is logged in and they live in room {me.room_number}</p>);
    } else {
        // No login, we serve the welcome page!
        return (<WelcomePage/>);
    }
};

Main.propTypes = {
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

export default graphql(currentUserQuery)(withRouter(Main))
