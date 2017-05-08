/**
 * Created by peter on 4/24/17.
 */

import {
    GraphQLObjectType as ObjectType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
    GraphQLList as ListType,
} from 'graphql';
import {resolver} from 'graphql-sequelize';
import {sequelize,Period,DinnerClub,Participation,User} from '../db';
import {attributeFields} from 'graphql-sequelize';
import DinnerClubType from './DinnerClubType';
import {SimpleUserType} from './SimpleUserType';
import DateType from './DateType';
import {createdAtDoc,updatedAtDoc} from '../docs/created_updated';

const getPeriodDinnerClubs = (root,extra) => {
    var where = {
        // Finds appropriate dinnerclubs
        at: {
            $gt: root.started_at,
            $lt: root.ended_at
        },
        // So we only look at dinnerclubs for this periods kitchen
        associatedKitchenId: root.periodKitchenId
    };
    return DinnerClub.findAll({
        where: where,
        ...extra
    });
};

let AccountingSplitType = new ObjectType({
    name: 'AccountingSplit',
    fields: {
        to_pay: {
            type: FloatType,
            description: 'Payment amount for this split'
        },
        user: {
            type: SimpleUserType,
            description: 'The user who needs to pay this split'
        }
    }
});

const PeriodType = new ObjectType({
    name: 'Period',
    fields: Object.assign(attributeFields(Period,{
        exclude: [
            'periodKitchenId',
            'started_at',
            'ended_at',
            'archived',
            'createdAt',
            'updatedAt'
        ]
    }),{ // Extra fields
        createdAt: {
            type: DateType,
            description: createdAtDoc
        },
        updatedAt: {
            type: DateType,
            description: updatedAtDoc
        },
        started_at: {
            type: DateType,
            description: 'Start of period date'
        },
        ended_at: {
            type: DateType,
            description: 'End of period date'
        },
        dinnerclubs: {
            type: new ListType(DinnerClubType),
            description: 'The dinnerclubs in this period of this kitchen',
            resolve: (root, args, context, info) => {
                return getPeriodDinnerClubs(root,{});
            },
        },
        // Gives the cost split for each user in this period
        accounting_split: {
            type: new ListType(AccountingSplitType),
            description: 'The accounting split for every member in the kitchen' +
            ' for the dinnerclubs they participated in.',
            // Not terribly optimized, but called rarely, so its probably fine
            resolve: (root, args, context, info) => {
                let extra = {
                    include: [
                        {
                            model: Participation,
                            // This 'as' must match the association name in db
                            as: 'participant',
                            include: [{model: User}],
                            // Ensures participant count is only people who have not cancelled
                            where: {
                                cancelled: false
                            },
                        },
                        {
                            model: User,
                            as: 'cook',
                            attributes: ['id']
                        }
                    ]
                };
                return getPeriodDinnerClubs(root,extra).then((dinnerclubs)=>{
                    // TODO join these maps
                    var userPayMap = new Map();
                    var uMap = new Map();
                    var expenseMap = new Map();
                    var ds = dinnerclubs.filter((d)=>!d.cancelled);
                    ds.forEach((d)=>{
                        // Cancelled participations are naturally not counted
                        let participants = d.get('participant').filter((p)=>!p.cancelled);
                        let totalGuestCount = participants.map((p)=>p.guest_count).reduce((acc,cur)=>acc+cur);
                        let totalPart = participants.length + totalGuestCount;
                        let avg_price = d.total_cost / totalPart;
                        // Accumulates the expense of the user cooking the meal
                        let accExpense = d.total_cost + ((expenseMap.has(d.cook.id)) ? expenseMap.get(d.cook.id) : 0.0);
                        expenseMap.set(d.cook.id,accExpense);
                        participants.forEach((p)=>{
                            // What a participant owes for this dinnerclub
                            let dp_price = avg_price*(1.0+p.guest_count);
                            // Accumulate cost of dinnerclub for the user
                            let price = (userPayMap.has(p.up_key)) ? (userPayMap.get(p.up_key)+dp_price) : dp_price;
                            userPayMap.set(p.up_key,price);
                            uMap.set(p.up_key,p.User);
                        });
                    });
                    var results = [];
                    userPayMap.forEach((v,k,m)=>{
                        // Pays their accumulated debt, minus the expense for the dinnerclubs they cooked
                        let final_debt = v - ((expenseMap.has(k)) ? expenseMap.get(k) : 0.0);
                        results.push({
                            to_pay: final_debt,
                            user: uMap.get(k)
                        });
                    });
                    return results;
                });
            }
        }
    }),
    description: 'A dinnerclub represents one dinner that the kitchen community have together'
});

export default PeriodType;

