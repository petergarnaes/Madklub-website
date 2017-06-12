/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import pure from 'recompose/pure';
import simpleUserFragment from './SimpleUserFragment.gql';

const CookComponent = ({cook}) => (
    <h3>{cook.display_name} laver mad</h3>
);

const PureCookComponent = pure(CookComponent);

PureCookComponent.propTypes = {
    cook: propType(simpleUserFragment).isRequired
};

export default PureCookComponent;