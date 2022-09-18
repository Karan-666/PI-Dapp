

pragma solidity >=0.4.21 <0.7.0;

contract Insurance {
     
     // Structure for crop type
	struct CropType {
	    string name;
	    uint premiumperAcre;
	    uint duration;
	    uint coverageperAcre;
	}

	CropType[2] public CropTypes;                              // Two types of crop defined in constructor

	enum policyState {Pending, Active, PaidOut, TimedOut}

	 // Structure for policy
	struct Policy {
	    string name;
	    uint area;
	    string location;
	    uint policyId;
	    address user;
	    uint premium;
	    uint startTime;
	    uint endTime;
	    uint coverageAmount;
	    uint claimAmount;
        uint cropId;
        policyState state;
	}

    Policy[] public Policies;
    

    mapping(address => uint[]) public userPolicies;
    
    function newPolicy (string memory _name, uint _area, string memory _location, uint _cropID ) public payable{
        
        
        uint pId = Policies.length++;
        userPolicies[msg.sender].push(pId);
        Policy memory p = Policies[pId];
        p.policyId = pId;
        p.name = _name;
        p.area = _area;
        p.location = _location;
        p.cropId = _cropID;
        p.user = msg.sender;
        p.premium = CropTypes[p.cropId].premiumperAcre * _area;
        p.startTime = now;
        p.endTime = now + CropTypes[p.cropId].duration * 30*24*60*60;
        p.coverageAmount = CropTypes[p.cropId].coverageperAcre * p.area;
        p.state = policyState.Active;
        
        require(msg.value == (p.premium),"INCORRECT PREMIUM AMOUNT");
        
    }



    function newCrop(uint _cropId, string memory _name, uint _premiumPerAcre, uint _duration, uint _coveragePerAcre) public {
        CropType memory c = CropType(_name, _premiumPerAcre, _duration, _coveragePerAcre);
        CropTypes[_cropId] = c;
    }

    constructor() public {

       newCrop(0, "rabi", 1, 6, 7);
       newCrop(1, "kharif", 2, 4, 10);
    }

    function claim( uint predicted_class, uint Id) public {
        
        require(msg.sender == Policies[Id].user, "User Not Authorized");
        require(Policies[Id].state == policyState.Active, "Policy Not Active");

        if(now > Policies[Id].endTime)
        {
            Policies[Id].state = policyState.TimedOut;
            revert("Policy's period has Ended.");
        }
        uint cl;
        if(predicted_class == 0)
        {
             cl = 0;
        }
        else if(predicted_class == 1)
        {
             cl = 100;
        }
        else if(predicted_class == 2)
        {
             cl = 60;
        }
        else if(predicted_class == 3)
        {
             cl = 50;
            
        }
        make_request(cl, Id);
    }
    function make_request(uint cl, uint Id) public {
        
        Policies[Id].claimAmount = (cl/100) * Policies[Id].coverageAmount;
    }
}    