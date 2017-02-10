/**
 * Created by peter on 2/10/17.
 */
import React from 'react';
import './styling.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const LoadingIcon = ({message}) =>{
    var msg = null;
    if(message) msg = <p className="loading-icon-message">{message}</p>;
    return (
        <div>
            <Glyphicon
                className="loading-icon"
                glyph="refresh" />
            {msg}
        </div>
    )
};

LoadingIcon.PropTypes = {
    message: React.PropTypes.string
};

export default LoadingIcon;
