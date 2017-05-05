/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import pure from 'recompose/pure';

const CookComponent = ({cook}) => (
    <h3>{cook.display_name} laver mad</h3>
);

const PureCookComponent = pure(CookComponent);

PureCookComponent.fragments = {
    simpleUser: gql`
        fragment CookComponentSimpleUser on SimpleUser {
            display_name
        }
    `
};

PureCookComponent.propTypes = {
    cook: propType(PureCookComponent.fragments.simpleUser).isRequired
};

export default PureCookComponent;