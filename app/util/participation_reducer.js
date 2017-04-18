/**
 * Created by peter on 4/18/17.
 */
import gql from 'graphql-tag';

export default (participants,userID) => participants.reduce(
    (pc,part) => {
        return ({
            isParticipating: pc.isParticipating || (part.user.id === userID),
            participationID: (part.user.id === userID) ? part.id : pc.participationID,
            hasCancelled: pc.hasCancelled || ((part.user.id === userID) && part.cancelled)
        })
    },
    {isParticipating: false,participationID: '',hasCancelled: false}
);

// Data requirement for the above reducer to work
export const participationFragment = gql`
    fragment isParticipatingDinnerClubParticipation on DinnerClubParticipation {
        id
        cancelled
        user {
            id
        }
    }
`;