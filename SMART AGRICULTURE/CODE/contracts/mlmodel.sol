pragma solidity ^0.5.16;
import "https://github.com/oraclize/ethereum-api/provableAPI_0.6.sol";


contract mlmodel is usingOraclize {
    uint public predicted_class;
    
    event newOraclizeQuery(string description);
    
    function __callback(bytes32 queryId, uint result, bytes proof) {
        if(msg.sender != oraclize_cbAddress()) revert();
        predicted_class = result;
    }
        
    
    function predict(string memory hash) payable public {
        newOraclizeQuery("Oraclize query was sent, standing by for the answer...");
        oraclize_query("URL", "json()", hash);
    }
}