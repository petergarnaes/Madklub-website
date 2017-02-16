/**
 * Created by peter on 2/16/17.
 */

export default (result) => {
    if (result.id && result.__typename) {
        console.log("Something: "+result.__typename + result.id);
        return result.__typename + result.id
    }
    return null
};