import React, { Component } from 'react';
import './App.css';
import Insurance from './Insurance';
import web3 from './web3';
import ipfs from './ipfs';
import storeMyValue from './storeMyValue';
class App extends Component {
state = {
ipfsHash:null,
buffer:'',
transactionHash:'',
gasUsed:'',
txReceipt: '' ,
};
captureFile =(event) => {
event.stopPropagation()
event.preventDefault()
const file = event.target.files[0]
let reader = new window.FileReader()
reader.readAsArrayBuffer(file)
reader.onloadend = () => this.convertToBuffer(reader)
};
convertToBuffer = async(reader) => {
//file is converted to a buffer for upload to IPFS
const buffer = await Buffer.from(reader.result);
//set this buffer -using es6 syntax
this.setState({buffer});
};
onSubmit = async (event) => {
event.preventDefault();
console.log("web3 value is ",web3.eth.getAccounts());
const accounts = await web3.eth.getAccounts();
console.log('Sending from Metamask account: ' , accounts[0]);
const ethAddress= await storeMyValue.options.address;
this.setState({ethAddress});
await ipfs.add(this.state.buffer, (err, ipfsHash) => {
console.log(err,ipfsHash);
this.setState({ ipfsHash:ipfsHash[0].hash });
storeMyValue.methods.set(this.state.ipfsHash).send({
from: accounts[0]
}, (error, transactionHash) => {
console.log("transaction hash is ",transactionHash);
this.setState({transactionHash});
});
})
};
render() {
return (
<div className="App">
<header className="App-header">
<h1> SMART AGRICULTURE</h1>
</header>
<hr />
<br/>
<h1> Want to take an insurance of your crop? </h1>
<h3> Fill the following details:</h3>
<script>
    function formCollect() {
        //Insurance.methods.newPolicy(fname, area, location, ctype)
    }
    
</script>
<form >
    <label for="fname">YOUR NAME:</label><br/>
    <input type="text" id="fname" name="fname"></input><br/>
    <label for="area">FARM AREA:</label><br></br>
    <input type="number" id="area" name="area"></input><br/>
    <label for="location">LOCATION:</label><br/>
    <input type="text" id="location" name="location"></input><br/>
    <label for="ctype">CROP ID (0 if rabi and 1 if kharif):</label><br/>
    <input type="text" id="ctype" name="ctype"></input><br/><br/>
    <button onClick="formCollect()">DONE</button>
</form>
<br/>
<br/>
<hr/>
<br/>
<h1 > Worried with a diseased plant!!! </h1>
<h3> Click an image of the affected leaf and send us!!! </h3><br/>
<form onSubmit={this.onSubmit}>
<label for="pId">POLICY ID:</label><br></br>
<input type="number" id="pId" name="pId"></input><br/><br/><br/>
<input type="file" onChange={this.captureFile}/>
<button type="submit"> Send it </button>
</form><br/><br/><br/>

<table border="1px solid black" align="center">
  
<thead>
<tr>
<th>Sl No</th>
<th>Values</th>
</tr>
</thead>
<tbody>
<tr>
<td>IPFS Hash </td>
<td>{this.state.ipfsHash}</td>
</tr>
<tr>
<td>Ethereum Contract Address  </td>
<td>{this.state.ethAddress}</td>
</tr>
<tr>
<td>Tx Hash # </td>
<td>{this.state.transactionHash}</td>
</tr>
</tbody>
</table>
<br/>
<br/>
<hr/>
</div>);
}
}
export default App;