/**
 * Created by peter on 5/3/17.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
//import fetch from 'isomorphic-fetch';
import * as Cookies from "js-cookie";
import 'graphiql/graphiql.css';

function graphQLFetcher(graphQLParams) {
    const token = Cookies.get("csrf_token");
    console.log('token is '+token);
    return fetch(window.location.origin + '/graphql', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin',
        body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
}

ReactDOM.render(
    <GraphiQL fetcher={graphQLFetcher} editorTheme="yeti">
        <GraphiQL.Logo>
            Madklub API Editor
        </GraphiQL.Logo>
    </GraphiQL>, document.getElementById('graphiql'));
