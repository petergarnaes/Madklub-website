/**
 * Created by peter on 2/3/17.
 */
import './styling.css';
import React from 'react';
import { Glyphicon } from 'react-bootstrap';

const RoundIconButton = ({glyph,onClick,isActive,activeColor,activeColorIcon}) => {
    var buttonProps, iconProps = {};
    if(isActive){
        buttonProps = {
            style: {
                background: activeColor
            }
        };
        iconProps = {
            style: {
                color: activeColorIcon
            }
        }
    }

    return (
        <button
            className="round-icon-button"
            onClick={onClick}
            {...buttonProps}>
            <Glyphicon
                className="the-icon"
                glyph={glyph}
                {...iconProps}/>
        </button>
    )
};

RoundIconButton.propTypes = {
    glyph: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    isActive: React.PropTypes.bool.isRequired,
    activeColor: React.PropTypes.string.isRequired,
    activeColorIcon: React.PropTypes.string.isRequired
};

export default RoundIconButton;