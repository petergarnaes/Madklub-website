/**
 * Created by peter on 1/30/17.
 */

import React from 'react';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';

const CookComponent = ({cook}) => (
    <h3>{cook.display_name} laver mad</h3>
);

CookComponent.fragments = {
    simpleUser: gql`
        fragment CookComponentSimpleUser on SimpleUser {
            display_name
        }
    `
};

CookComponent.propTypes = {
    cook: propType(CookComponent.fragments.simpleUser).isRequired
};

export default CookComponent;