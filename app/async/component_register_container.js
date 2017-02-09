/**
 * Created by peter on 2/9/17.
 */
import React from 'react';

class RegisterComponentContainer extends React.Component {
    constructor(props) {
        super(props);
        this.registeredComponents =
            this.props.registeredComponents ? this.props.registeredComponents : [];
    }

    static childContextTypes = {
        registeredComponents: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }

    getChildContext() {
        return {
            registeredComponents: this.registeredComponents
        }
    }

    render() {
        const children = this.props.children;
        return (
            <div>
                {children}
            </div>
        );
    }
}

RegisterComponentContainer.propTypes = {
    registeredComponents: React.PropTypes.arrayOf(React.PropTypes.string)
};

export const withComponentRegister = (component) => {
    return class extends React.Component {
        static displayName = `withComponentRegister(${component.displayName || component.name})`
        static contextTypes = {
            registeredComponents: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
        }

        render() {
            let props = this.props;
            return React.createElement(component, {
                ...props,
                isRegistered: (componentKey) => this.context.registeredComponents.includes(componentKey),
                registerComponent: (componentKey) => {
                    if(!this.context.registeredComponents.includes(componentKey)){
                        this.context.registeredComponents.push(componentKey)
                    }
                }
            })
        }
    }
}

export default RegisterComponentContainer;