/**
 * Created by peter on 1/30/17.
 */
import React from 'react';
import { logout } from '../../actions/login';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

let LogoutView = class extends React.Component {
    componentWillMount () {
        // We only get here after visiting /logout on the server, which means
        // cookie is deleted and we can go to front page
        this.props.logout();
        this.props.router.replace('/');
    }

    render () {
        return null;
    }
};

const mapStateToProps = (_) => ({});

const mapDispatchToProps = (dispatch) => ({
    logout: () => {
        dispatch(logout())
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(LogoutView));