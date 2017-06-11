/**
 * Created by peter on 4/18/17.
 */
import update from 'immutability-helper';

let queryRoutine = (dinnerclubID) => (previousResult, { mutationResult }) => {
    const newDinnerclub = mutationResult.data.changeDinnerClub;
    const newDinID = newDinnerclub.id;
    const newShoppingComplete = newDinnerclub.shopping_complete;
    const updateDinnerclubIndex = previousResult.me.kitchen.
            dinnerclubs.findIndex((d)=>d.id === dinnerclubID);
    let newResult = update(previousResult,{
        me: {
            kitchen: {
                dinnerclubs: {
                    $apply: (l)=>{
                        l[updateDinnerclubIndex].shopping_complete = newShoppingComplete;
                        return l;
                    }
                }
            }
        }
    });
    return newResult;
};

export const completeShoppingOptions = (queryName) => ({
    props({_,mutate}) {
        return {
            setShoppingComplete(dinnerclubID,value){
                let updateQueriesObj = {};
                updateQueriesObj[queryName] = queryRoutine(dinnerclubID);
                return mutate({
                    variables: {
                        dinnerclubID: dinnerclubID,
                        value: value
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        changeDinnerClub: {
                            __typename: 'DinnerClub',
                            id: dinnerclubID,
                            shopping_complete: value
                        }
                    },
                    updateQueries: updateQueriesObj
                })
            }
        }
    }
});

