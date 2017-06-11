/**
 * Created by peter on 10-05-17.
 */
import React from 'react';
//import gql from 'graphql-tag';
import { gql, graphql } from 'react-apollo';
import LoadingIcon from '../../loading_icon';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavItem from 'react-bootstrap/lib/NavItem';
import withRouter from 'react-router-dom/withRouter';

const goTo = (history) => (key) => {
    var url = "/"+key;
    if(key) history.push(url);
};

// TODO remove display_name prop and all the redux stuff
const SessionComponent = ({data,display_name,history}) => {
    let {loading,error,me} = data;
    //let me = {id: 'bb', kitchen: {admin: {id: 'bb'}}};
    //let loading = false;
    //let error = null;
    console.log(me);
    if(loading){
        return (
            <NavItem>Loading</NavItem>
        )
    }
    // TODO error!
    if(error){
        console.log('Error!');
        console.log(error);
    }
    var AdminSettings = null;
    var AccountingOption = null;
    if(me.id === me.kitchen.admin.id){
        // Current user is admin
        AdminSettings = <MenuItem eventKey="admin_settings" onSelect={goTo(history)}>
            Admin Indstillinger
            <Glyphicon
                style={{paddingLeft:1+'em'}}
                glyph="cutlery"/>
        </MenuItem>;
        AccountingOption = <MenuItem eventKey="accounting" onSelect={goTo(history)}>
            Regnskabs værktøj
            <Glyphicon
                style={{paddingLeft:1+'em'}}
                glyph="piggy-bank"/>
        </MenuItem>;
    }
    return (
        <NavDropdown title={me.display_name} id="basic-nav-dropdown">
            {AccountingOption}
            {AdminSettings}
            <MenuItem eventKey="user_settings" onSelect={goTo(history)}>
                Indstillinger
                <Glyphicon
                    style={{paddingLeft:1+'em'}}
                    glyph="cog"/>
            </MenuItem>
            <MenuItem divider />
            <MenuItem href="/logout">Logout</MenuItem>
        </NavDropdown>
    )
};

const navbarQuery = gql`
    query navbarQuery {
        me {
            id
            display_name
            kitchen {
                id
                admin {
                    id
                }
            }
        }
    }
`;

// Somehow not SSR this query fixes calendar query?
export default graphql(navbarQuery,{
    options: {
        ssr: false
    }
})(withRouter(SessionComponent))
//export default withRouter(SessionComponent)
