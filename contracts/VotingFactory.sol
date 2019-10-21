pragma solidity >=0.5.0 <0.7.0;

import "./Voting.sol";

contract VotingFactory {

    uint public noOfCampaigns;
    address private electionCommission;

    mapping(uint => CampaignWrapper) private deployedCampaigns;

    // Wrapper struct for easy mapping of campaigns
    struct CampaignWrapper {
        address campaignAddr; // address of the voting campaign
        string name; // name of the campaign
    }

    constructor() public {
        electionCommission = msg.sender;
    }

    /**********************
    *   EVENTS
    ***********************/

    event CampaignCreated(uint _memberFee, string _name);

    modifier onlyEC {
        require(msg.sender == electionCommission, "Only EC is allowed to perform this action");
        _;
    }

    /**
     * @dev Used by EC to create campaigns
     * @param _memberFee Individual member registration fee (wei)
     * @param _name Name of the campaign
     */
    function createCampaign(uint _memberFee, string memory _name) public onlyEC returns (bool created) {
        noOfCampaigns++;
        deployedCampaigns[noOfCampaigns] = CampaignWrapper({
            campaignAddr: address(new Voting(_memberFee, msg.sender, _name)),
            name: _name
        });

        emit CampaignCreated(_memberFee, _name);

        return true;
    }

    /**
     * @dev Get address and name of deployed campaign
     * @param _campaignId ID of campaign to be returned
     */
    function getCampaign(uint _campaignId) public view onlyEC
    returns (address campaignAddress, string memory campaignName) {
        assert(_campaignId > 0 && _campaignId <= noOfCampaigns);

        CampaignWrapper memory campaign = deployedCampaigns[_campaignId];

        return (campaign.campaignAddr, campaign.name);
    }

}