let constants = {};
constants.organization = 'poanetwork';
constants.repoName = 'poa-chain-spec';
constants.addressesSourceFile = 'contracts.json';
constants.ABIsSources = {
	'KeysManager': 'KeysManager.abi.json',
	'PoaNetworkConsensus': 'PoaNetworkConsensus.abi.json',
	'BallotStorage': 'BallotsStorage.abi.json',
	'ProxyStorage': 'ProxyStorage.abi.json',
	'ValidatorMetadata': 'ValidatorMetadata.abi.json',
	'VotingToChangeKeys': 'VotingToChangeKeys.abi.json',
	'VotingToChangeMinThreshold': 'VotingToChangeMinThreshold.abi.json',
	'VotingToChangeProxyAddress': 'VotingToChangeProxyAddress.abi.json'
};
constants.NEW_MINING_KEY = {
	label: "New Mining Key",
	lastNameAndKey: "",
	fullName: "",
	value: "0x0000000000000000000000000000000000000000"
};
constants.minBallotDurationInDays = 2;
constants.startTimeOffsetInMinutes = 5;
constants.endTimeDefaultInMinutes = 2890;
module.exports = {
	constants
}