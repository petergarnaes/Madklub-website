import React from 'react';

export default class AppView extends React.Component {
    render() {
        return (
            <div id="app-view">
                <h1>Todos and stuff</h1>

                <hr />

                {this.props.children}
            </div>
        );
    }
}
