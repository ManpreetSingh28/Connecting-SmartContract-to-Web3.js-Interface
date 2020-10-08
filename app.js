const express = require('express');
const app = express();

const Web3 = require('web3');
//const web3 = new Web3("https://localhost:8545");
const web3 = new Web3("https://ropsten.infura.io/v3/ee41e14cda574dc4870fa083201c07a7");
//const ganache = require("ganache-cli");
//const web3 = new Web3(ganache.provider());

web3.eth.getAccounts(function(err, accounts) {
    console.log(accounts)
})

var account = "0x30dE9A34058848Bc1f91b72BdaD26cDF863A6dB1";

//hidestream
var pkey = "81a95817cbf7f7623ce4a1c0183c13c56b2c255fe652fa31eabe1f588adbb4a8";

var abi = [
	{
		"inputs": [],
		"name": "getWord",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_word",
				"type": "string"
			}
		],
		"name": "setWord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

var contractAddress = "0x0Ff055e917c276020f354F27aEDcAe57de5d62D3";

var myContract = new web3.eth.Contract(abi, contractAddress);

console.log(myContract.methods);

app.get('/', function (req, res) {
	res.sendFile('D:/testnpm/public/index.html');
	//res.send('Legend');
});

app.get('/getOutput', function (req, res) {
	myContract.methods.getWord().call({from: account}).then(function(result) {
		console.log(result);
		res.send(result);
	})
});

app.post('/giveInput/:ID', function (req, res) {
	console.log(req.params.ID);
	var encodedData = myContract.methods.setWord(req.params.ID).encodeABI();
	console.log(encodedData);

var transactionObject = {
    gas: "470000",
    data: encodedData,
    from: account,
    to: contractAddress
}

web3.eth.accounts.signTransaction(transactionObject, pkey, function(error, trans) {
    console.log(trans);
    web3.eth.sendSignedTransaction(trans.rawTransaction)
    .on("receipt", function(result) {
		console.log(result);
		res.send(result);
    })
});
});
 
app.listen(3000);