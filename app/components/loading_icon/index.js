/**
 * Created by peter on 2/10/17.
 */
import React from 'react';
import './styling.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import pure from 'recompose/pure';

const LoadingIcon = ({message}) =>{
    var msg = null;
    if(message) msg = <p className="loading-icon-message">{message}</p>;
    return (
        <div className="loading-icon-container">
            <Glyphicon
                className="loading-icon"
                glyph="refresh" />
            {msg}
        </div>
    )
};

const PureLoadingIcon = pure(LoadingIcon);

PureLoadingIcon.PropTypes = {
    message: React.PropTypes.string
};

export default PureLoadingIcon;
