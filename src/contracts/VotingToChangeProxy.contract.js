import Web3 from 'web3';
import { networkAddresses } from './addresses';
import helpers from "./helpers";

export default class VotingToChangeProxy {
  async init({web3, netId}) {
    const {VOTING_TO_CHANGE_PROXY_ADDRESS} = networkAddresses(netId);
    console.log('VotingToChangeProxy address', VOTING_TO_CHANGE_PROXY_ADDRESS)
    let web3_10 = new Web3(web3.currentProvider);

    const branch = helpers.getBranch(netId);

    let votingToChangeProxyABI = await helpers.getABI(branch, 'VotingToChangeProxyAddress')

    this.votingToChangeProxyInstance = new web3_10.eth.Contract(votingToChangeProxyABI, VOTING_TO_CHANGE_PROXY_ADDRESS);
    this.gasPrice = web3_10.utils.toWei('1', 'gwei');
  }

  //setters
  createBallot({startTime, endTime, proposedValue, contractType, sender, memo}) {
    let method;
    if (this.votingToChangeProxyInstance.methods.createBallot) {
      method = this.votingToChangeProxyInstance.methods.createBallot;
    } else {
      method = this.votingToChangeProxyInstance.methods.createBallotToChangeProxyAddress;
    }
    return method(startTime, endTime, proposedValue, contractType, memo).send({from: sender, gasPrice: this.gasPrice})
  }

  vote(_id, choice, sender) {
    return this.votingToChangeProxyInstance.methods.vote(_id, choice).send({from: sender, gasPrice: this.gasPrice})
  }

  finalize(_id, sender) {
    return this.votingToChangeProxyInstance.methods.finalize(_id).send({from: sender, gasPrice: this.gasPrice})
  }

  //getters
  doesMethodExist(methodName) {
    if (this.votingToChangeProxyInstance.methods[methodName]) {
      return true;
    }
    return false;
  }

  nextBallotId() {
    return this.votingToChangeProxyInstance.methods.nextBallotId().call();
  }

  votingState(_id) {
    if (this.doesMethodExist('votingState')) {
      return this.votingToChangeProxyInstance.methods.votingState(_id).call();
    }
    return null;
  }

  getBallotInfo(_id, _votingKey) {
    if (this.doesMethodExist('getBallotInfo')) {
      return this.votingToChangeProxyInstance.methods.getBallotInfo(_id, _votingKey).call();
    }
    return null;
  }

  hasAlreadyVoted(_id, votingKey) {
    return this.votingToChangeProxyInstance.methods.hasAlreadyVoted(_id, votingKey).call();
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeProxyInstance.methods.isValidVote(_id, votingKey).call();
  }

  isActive(_id) {
    return this.votingToChangeProxyInstance.methods.isActive(_id).call();
  }

  canBeFinalizedNow(_id) {
    if (this.doesMethodExist('canBeFinalizedNow')) {
      return this.votingToChangeProxyInstance.methods.canBeFinalizedNow(_id).call();
    }
    return null;
  }

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeProxyInstance.methods.getMiningByVotingKey(_votingKey).call();
  }

  async getValidatorActiveBallots(_votingKey) {
    let miningKey;
    try {
      miningKey = await this.getMiningByVotingKey(_votingKey);
    } catch(e) {
      miningKey = "0x0000000000000000000000000000000000000000";
    }
    return await this.votingToChangeProxyInstance.methods.validatorActiveBallots(miningKey).call();
  }

  async getBallotLimit(_votingKey) {
    const currentLimit = await this.votingToChangeProxyInstance.methods.getBallotLimitPerValidator().call();
    return currentLimit - await this.getValidatorActiveBallots(_votingKey);
  }
}