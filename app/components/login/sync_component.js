/**
 * Created by peter on 2/7/17.
 */
import Login from './index';
import React from 'react';
import { connect } from 'react-redux';
import { registerRoute } from '../../actions/async_routes';

class SyncLogin extends React.Component {
    render(){
        console.log('Loading route synchronously');
        this.props.markAsSRR('login');
        return <Login />;
    }
}

const Stuff = (props) => (<SyncLogin {...props}/>);

//const SyncLogin = ({markAsSRR}) => {
//};

const mapStateToProps = (_) => ({});
const mapDispatchToProps = (dispatch) => ({
    markAsSRR: (key) => dispatch(registerRoute(key))
});

 export default connect(mapStateToProps,mapDispatchToProps)(Stuff);