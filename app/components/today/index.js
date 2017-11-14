/**
 * Created by peter on 1/30/17.
 */

import React from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import FrontPageDinnerClubComponent from "../front_page_dinnerclub";
import FrontPageCookComponent from "../front_page_dinnerclub_cook";
import LoadingIcon from "../loading_icon";
import participationReducer from "../../util/participation_reducer";
import todayUserQuery from "./todayUserQuery.gql";

const TodayWithData = ({ data }) => {
  let { loading, error, me } = data;
  console.log("Toady");
  console.log(data);
  console.log(loading);
  console.log(me);
  if (loading) {
    return <LoadingIcon message="Loading..." />;
  }
  // TODO error!
  if (error) {
    console.log("Error!");
    console.log(error);
  }

  // DinnerClubs always ordered by 'at' date, so picking first will be the next one.
  let dinnerClubToday = me.kitchen.dinnerclubs[0];
  // TODO Make this look nicer
  if (!dinnerClubToday) {
    return <p>No Dinner club today peeps!</p>;
  }
  // Figures out if current user is the cook
  let isCook = me.id === dinnerClubToday.cook.id;
  console.log("Are we the cook today? " + isCook);
  if (isCook) {
    return <FrontPageCookComponent dinnerClub={dinnerClubToday} />;
  } else {
    // Figuring out if current user participates
    let {
      isParticipating,
      participationID,
      hasCancelled
    } = participationReducer(dinnerClubToday.participants, me.id);
    return (
      <FrontPageDinnerClubComponent
        dinnerClub={dinnerClubToday}
        participationID={participationID}
        isParticipating={isParticipating}
        hasCancelled={hasCancelled}
      />
    );
  }
};

TodayWithData.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.object,
    me: React.PropTypes.object
  }).isRequired
};

// Queries all of today (midnight to midnight), so we can pick the first upcoming one.
// millisecond set, so client AND server side construct the same query, therefore NOT refetching
// TODO not relevant for Madklub, but maybe set timezone in Redux, so we can set it here and ensure the same query happens on both client/server
// TODO maybe query from this moment forward instead? Let server Redux set the time?
let todayStart = moment()
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .toISOString();
let todayEnd = moment()
  .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
  .toISOString();
console.log("From " + todayStart + " To " + todayEnd);

const TodayPage = graphql(todayUserQuery, {
  options: {
    variables: {
      todayStart: todayStart,
      todayEnd: todayEnd
    }
  }
})(TodayWithData);

export default TodayPage;
