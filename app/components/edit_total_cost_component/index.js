/**
 * Created by peter on 5/8/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import moment from 'moment';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';

class TotalCostEditComponent extends React.Component {
    constructor(props){
        super(props);
        this.toggleTotalCostEdit = this.toggleTotalCostEdit.bind(this);
        this.onTotalCostChange = this.onTotalCostChange.bind(this);
        this.state = {
            total_cost: props.dinnerClub.total_cost,
            editToggled: false,
            isTotalCostValid: (TotalCostEditComponent.isTotalCostValid(props.dinnerClub.total_cost) ? null : 'warning')
        };
    }

    static isTotalCostValid(val){
        var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
        if (!floatRegex.test(val))
            return false;

        val = parseFloat(val);
        if (isNaN(val))
            return false;
        return true;
    }

    onTotalCostChange(e){
        let totalCost = e.target.value;
        let validate = (TotalCostEditComponent.isTotalCostValid(totalCost)) ? null : 'warning';
        this.setState({
            total_cost: totalCost,
            isTotalCostValid: validate
        });
    }

    toggleTotalCostEdit(){
        // If true, we are going to false
        if(this.state.editToggled)
            this.props.setTotalCost(this.props.dinnerClub.id,this.state.total_cost);
        this.setState({
            editToggled: !this.state.editToggled
        })
    }

    render(){
        let glyph = (this.state.editToggled) ? "ok" : "pencil";
        if(this.state.editToggled){
            return (
                <Form inline>
                    <FormGroup validationState={this.state.isTotalCostValid}>
                        <FormControl
                            type="text"
                            value={this.state.total_cost}
                            placeholder="Måltid"
                            onChange={this.onTotalCostChange}/>
                        <Button
                            bsStyle="primary"
                            disabled={!(this.state.isTotalCostValid === null)}
                            onClick={this.toggleTotalCostEdit}>
                            <Glyphicon glyph={glyph}/>
                        </Button>
                        {this.state.isTotalCostValid &&
                        <HelpBlock>
                            Indtast rigtig pris
                        </HelpBlock>}
                    </FormGroup>
                </Form>
            )
        } else {
            return (
                <h3>
                    Pris: {this.state.total_cost}&emsp;
                    <Button
                        bsStyle="primary"
                        onClick={this.toggleTotalCostEdit}>
                        <Glyphicon glyph={glyph}/>
                    </Button>
                </h3>
            )
        }
    }
}

TotalCostEditComponent.fragments = {
    dinnerclub: gql`
        fragment TotalCostEditDinnerClub on DinnerClub {
            id
            total_cost
        }
    `
};

TotalCostEditComponent.propTypes = {
    dinnerClub: propType(TotalCostEditComponent.fragments.dinnerclub).isRequired,
    setTotalCost: React.PropTypes.func.isRequired
};

const mealEditMutation = gql`
    mutation changeTotalCost($dinnerclubID: ID!,$total_cost: Float!){
       changeDinnerClub(id: $dinnerclubID,total_cost: $total_cost){
            id
            total_cost
       }
    }
`;

export default graphql(mealEditMutation,{
    props({_,mutate}) {
        return {
            setTotalCost(dinnerclubID,total_cost){
                return mutate({
                    variables: {
                        dinnerclubID: dinnerclubID,
                        total_cost: total_cost
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        changeDinnerClub: {
                            __typename: 'DinnerClub',
                            id: dinnerclubID,
                            total_cost: total_cost
                        }
                    },
                    updateQueries: {
                        currentUserQuery: (previousResult, { mutationResult }) => {
                            const newDinnerclub = mutationResult.data.changeDinnerClub;
                            const newDinID = newDinnerclub.id;
                            const newTotalCost = newDinnerclub.total_cost;
                            const updateDinnerclubIndex = previousResult.me.kitchen.
                                dinnerclubs.findIndex((d)=>d.id === dinnerclubID);
                            let newResult = update(previousResult,{
                                me: {
                                    kitchen: {
                                        dinnerclubs: {
                                            $apply: (l)=>{
                                                l[updateDinnerclubIndex].total_cost = newTotalCost;
                                                return l;
                                            }
                                        }
                                    }
                                }
                            });
                            return newResult;
                        }
                    }
                })
            }
        }
    }
})(TotalCostEditComponent);

