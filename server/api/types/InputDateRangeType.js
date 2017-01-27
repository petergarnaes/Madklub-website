/**
 * Created by peter on 1/27/17.
 */
import {
    GraphQLNonNull as NonNull,
    GraphQLString as StringType,
    GraphQLInputObjectType as InputObjectType,
} from 'graphql';

const InputDateRangeType = new InputObjectType({
    name: 'DateRange',
    fields: {
        start: {
            type: new NonNull(StringType),
            description: 'Start date of the range, only accepts ISO 8601 date format'
        },
        end: {
            type: new NonNull(StringType),
            description: 'End date of the range, only accepts ISO 8601 date format'
        }
    },
    description: 'A range defined by a start date and end date, only accepts ISO 8601 date format'
});

export default InputDateRangeType;