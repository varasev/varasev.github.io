import Web3 from 'web3';
import { networkAddresses } from './addresses';
import helpers from "./helpers";

export default class VotingToChangeMinThreshold {
  async init({web3, netId}) {
    const {VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS} = networkAddresses(netId);
    console.log('VotingToChangeMinThreshold address', VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS);
    let web3_10 = new Web3(web3.currentProvider);

    const branch = helpers.getBranch(netId);

    let votingToChangeMinThresholdABI = await helpers.getABI(branch, 'VotingToChangeMinThreshold')

    this.votingToChangeMinThresholdInstance = new web3_10.eth.Contract(votingToChangeMinThresholdABI, VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS);
    this.gasPrice = web3_10.utils.toWei('1', 'gwei');
  }

  //setters
  createBallot({startTime, endTime, proposedValue, sender, memo}) {
    let method;
    if (this.votingToChangeMinThresholdInstance.methods.createBallot) {
      method = this.votingToChangeMinThresholdInstance.methods.createBallot;
    } else {
      method = this.votingToChangeMinThresholdInstance.methods.createBallotToChangeThreshold;
    }
    return method(startTime, endTime, proposedValue, memo).send({from: sender, gasPrice: this.gasPrice})
  }

  vote(_id, choice, sender) {
    return this.votingToChangeMinThresholdInstance.methods.vote(_id, choice).send({from: sender, gasPrice: this.gasPrice})
  }

  finalize(_id, sender) {
    return this.votingToChangeMinThresholdInstance.methods.finalize(_id).send({from: sender, gasPrice: this.gasPrice})
  }

  //getters
  doesMethodExist(methodName) {
    if (this.votingToChangeMinThresholdInstance.methods[methodName]) {
      return true;
    }
    return false;
  }

  nextBallotId() {
    return this.votingToChangeMinThresholdInstance.methods.nextBallotId().call();
  }

  votingState(_id) {
    if (this.doesMethodExist('votingState')) {
      return this.votingToChangeMinThresholdInstance.methods.votingState(_id).call();
    }
    return null;
  }

  getBallotInfo(_id, _votingKey) {
    if (this.doesMethodExist('getBallotInfo')) {
      return this.votingToChangeMinThresholdInstance.methods.getBallotInfo(_id, _votingKey).call();
    }
    return null;
  }

  hasAlreadyVoted(_id, votingKey) {
    return this.votingToChangeMinThresholdInstance.methods.hasAlreadyVoted(_id, votingKey).call();
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeMinThresholdInstance.methods.isValidVote(_id, votingKey).call();
  }

  isActive(_id) {
    return this.votingToChangeMinThresholdInstance.methods.isActive(_id).call();
  }

  canBeFinalizedNow(_id) {
    if (this.doesMethodExist('canBeFinalizedNow')) {
      return this.votingToChangeMinThresholdInstance.methods.canBeFinalizedNow(_id).call();
    }
    return null;
  }

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeMinThresholdInstance.methods.getMiningByVotingKey(_votingKey).call();
  }

  async getValidatorActiveBallots(_votingKey) {
    let miningKey;
    try {
      miningKey = await this.getMiningByVotingKey(_votingKey);
    } catch(e) {
      miningKey = "0x0000000000000000000000000000000000000000";
    }
    return await this.votingToChangeMinThresholdInstance.methods.validatorActiveBallots(miningKey).call();
  }

  async getBallotLimit(_votingKey) {
    const currentLimit = await this.votingToChangeMinThresholdInstance.methods.getBallotLimitPerValidator().call();
    return currentLimit - await this.getValidatorActiveBallots(_votingKey);
  }
}
