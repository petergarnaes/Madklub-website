/**
 * Created by peter on 2/3/17.
 */
import './styling.css';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import pure from 'recompose/pure';

const RoundIconButton = ({glyph,onClick,isActive,activeColor,activeColorIcon,isDisabled}) => {
    var buttonProps = {style: {}}, iconProps = {style: {}};
    var disabled = isActive ? '' : 'disabled';
    if(isActive){
        buttonProps.style.background = activeColor;
        iconProps.style.color = activeColorIcon;
    }
    if(isDisabled){
        buttonProps.style.opacity = 0.4;
    }

    return (
        <button
            className="round-icon-button"
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            {...buttonProps}>
            <Glyphicon
                className="the-icon"
                glyph={glyph}
                {...iconProps}/>
        </button>
    )
};

const PureRoundIconButton = pure(RoundIconButton);

PureRoundIconButton.propTypes = {
    glyph: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    isActive: React.PropTypes.bool.isRequired,
    activeColor: React.PropTypes.string.isRequired,
    activeColorIcon: React.PropTypes.string.isRequired,
    isDisabled: React.PropTypes.bool
};

export default PureRoundIconButton;