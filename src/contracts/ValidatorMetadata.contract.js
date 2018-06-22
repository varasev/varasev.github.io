import Web3 from 'web3';
import { networkAddresses } from './addresses';
import helpers from "./helpers";
import { toAscii } from "../helpers";

export default class ValidatorMetadata {
  async init({web3, netId}) {
    const {METADATA_ADDRESS} = networkAddresses(netId);
    console.log('Metadata address', METADATA_ADDRESS)
    let web3_10 = new Web3(web3.currentProvider);

    const branch = helpers.getBranch(netId);

    let MetadataAbi = await helpers.getABI(branch, 'ValidatorMetadata')

    this.metadataInstance = new web3_10.eth.Contract(MetadataAbi, METADATA_ADDRESS);
  }

  async getValidatorFullName({votingKey, miningKey}){
    miningKey = miningKey || await this.getMiningByVoting(votingKey);
    let validator;
    if (this.metadataInstance.methods.getValidatorName) {
      validator = await this.metadataInstance.methods.getValidatorName(miningKey).call();
    } else {
      validator = await this.metadataInstance.methods.validators(miningKey).call();
    }
    return {
      firstName: toAscii(validator.firstName),
      lastName: toAscii(validator.lastName)
    }
  }

  async getMiningByVoting(votingKey){
    return await this.metadataInstance.methods.getMiningByVotingKey(votingKey).call();
  }
}
