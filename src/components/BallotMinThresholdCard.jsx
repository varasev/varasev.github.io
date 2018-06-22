import React from "react";
import { inject, observer } from "mobx-react";
import { BallotCard } from "./BallotCard";

@inject("commonStore", "routing")
@observer
export class BallotMinThresholdCard extends React.Component {
  render () {
    let { id, votingState } = this.props;
    return (
      <BallotCard votingType="votingToChangeMinThreshold" votingState={votingState} id={id}>
        <div className="ballots-about-i ballots-about-i_proposed-min-threshold">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Proposed min threshold</p>
          </div>
          <div className="ballots-about-td">
            <p>{votingState.proposedValue}</p>
          </div>
        </div>
      </BallotCard>
    );
  }
}
