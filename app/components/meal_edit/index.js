/**
 * Created by peter on 4/17/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import moment from 'moment';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';

class MealEditComponent extends React.Component {
    constructor(props){
        super(props);
        this.toggleMealEdit = this.toggleMealEdit.bind(this);
        this.state = {
            meal: props.dinnerClub.meal,
            editToggled: false
        };
    }

    toggleMealEdit(){
        console.log("Hay?");
        // TODO save and mutate meal
        // If true, we are going to false
        if(this.state.editToggled)
            this.props.setMeal(this.props.dinnerClub.id,this.state.meal);
        this.setState({
            editToggled: !this.state.editToggled
        })
    }

    render(){
        let glyph = (this.state.editToggled) ? "ok" : "pencil";
        if(this.state.editToggled){
            return (
                <Form inline>
                    <FormControl
                        type="text"
                        value={this.state.meal}
                        placeholder="Måltid"
                        onChange={(e)=>this.setState({meal: e.target.value})}/>
                    <Button
                        bsStyle="primary"
                        onClick={this.toggleMealEdit}>
                        <Glyphicon glyph={glyph}/>
                    </Button>
                </Form>
            )
        } else {
            return (
                <h3>
                    Menu: {this.state.meal}&emsp;
                    <Button
                        bsStyle="primary"
                        onClick={this.toggleMealEdit}>
                        <Glyphicon glyph={glyph}/>
                    </Button>
                </h3>
            )
        }
    }
}

MealEditComponent.fragments = {
    dinnerclub: gql`
        fragment MealEditDinnerClub on DinnerClub {
            id
            meal
        }
    `
};

MealEditComponent.propTypes = {
    dinnerClub: propType(MealEditComponent.fragments.dinnerclub).isRequired,
    setMeal: React.PropTypes.func.isRequired
};

const mealEditMutation = gql`
    mutation changeMeal($dinnerclubID: ID!,$meal: String!){
       changeDinnerClub(id: $dinnerclubID,meal: $meal){
            id
            meal
       }
    }
`;

export default graphql(mealEditMutation,{
    props({_,mutate}) {
        return {
            setMeal(dinnerclubID,meal){
                return mutate({
                    variables: {
                        dinnerclubID: dinnerclubID,
                        meal: meal
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        changeDinnerClub: {
                            __typename: 'DinnerClub',
                            id: dinnerclubID,
                            meal: meal
                        }
                    },
                    updateQueries: {
                        currentUserQuery: (previousResult, { mutationResult }) => {
                            const newDinnerclub = mutationResult.data.changeDinnerClub;
                            const newDinID = newDinnerclub.id;
                            const newMeal = newDinnerclub.meal;
                            const updateDinnerclubIndex = previousResult.me.kitchen.
                                dinnerclubs.findIndex((d)=>d.id === dinnerclubID);
                            let newResult = update(previousResult,{
                                me: {
                                    kitchen: {
                                        dinnerclubs: {
                                            $apply: (l)=>{
                                                l[updateDinnerclubIndex].meal = newMeal;
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
})(MealEditComponent);