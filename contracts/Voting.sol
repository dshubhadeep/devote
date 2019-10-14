pragma solidity >=0.5.0 <0.7.0;

contract Voting {

    /**********************
    *   PUBLIC VARS
    ***********************/

    // Election commission
    address payable public electionCommission;
    // Name of campaign
    string public campaignName;
    // Checks whether campaign has been completed (default - false)
    bool public completed;
    // Keeps track of no. of candidates in campaign
    uint public noOfCandidates;
    // Keep track of accepted candidates
    uint public acceptedCandidateCount;
    // Keep track of rejected candidates
    uint public rejectedCandidateCount;
    // Keep track of no. of voters
    uint public noOfVoters;
    // Keeps track of candidates who have applied to campaign
    mapping(uint => Candidate) public candidates;

    // Track entry's approval stage
    enum EntryStage {REJECT, NOT_DECIDED, ACCEPT}

    struct Candidate {
        address candidateAddr; // Unique id for candidate
        string name; // human readable name
        uint noOfVotes; // current vote count (default - 0)
        EntryStage stage; // Approval status (default - NOT_DECIDED)
        uint members; // members present in party
        string ipfsHash; // contains document for file verification
    }

    struct Voter {
        bytes32 uid; // TODO : Look into EPIC
        bool voted; // track if voter has already voted
    }

    constructor(uint _memberFee, address payable _ec, string memory _campaignName) public {
        electionCommission = _ec;
        memberFee = _memberFee;
        campaignName = _campaignName;
        completed = false;
    }

    /**********************
    *   PRIVATE VARS
    ***********************/

    // Individual member registration fee (wei)
    uint private memberFee;
    // Used for tracking the no. of times candidate has applied
    mapping(string => bool) private candidateChecker;
    // Used for tracking voters
    mapping(address => Voter) private voters;

    /**********************
    *   ADMIN FUNCTIONS
    ***********************/

    modifier onlyEC {
        require(msg.sender == electionCommission, "Only EC is allowed to perform this action");
        _;
    }

    modifier onlyOngoingCampaign {
        require(!completed, "Campaign is closed");
        _;
    }

    /**
     * @dev Approve candidate for election
     * @param _candidateId Id of the candidate
     */
    function approveEntry(uint _candidateId) public onlyEC onlyOngoingCampaign returns (bool entryStatus) {
        assert(_candidateId > 0 && _candidateId <= noOfCandidates);
        candidates[_candidateId].stage = EntryStage.ACCEPT;
        acceptedCandidateCount++;

        return true;
    }

    /**
     * @dev Reject candidate for election
     * @param _candidateId Id of the candidate
     */
    function rejectEntry(uint _candidateId) public onlyEC onlyOngoingCampaign returns (bool rejectStatus) {
        assert(_candidateId > 0 && _candidateId <= noOfCandidates);
        candidates[_candidateId].stage = EntryStage.REJECT;
        rejectedCandidateCount++;

        return true;
    }

    /**
     * @dev Allows EC to close campaign
     */
     function closeCampaign() public onlyEC returns (bool closed) {
         completed = true;
         return true;
     }

    /**
     * @dev Getter for member fee
     */
    function getMemberFee() public view returns (uint fee) {
        return memberFee;
    }

    /**
     * @dev Candidates (Party) can submit their entry to be approved
     * @param _name Name of the candidate
     * @param _members No. of members in party
     * @param _ipfsHash IPFS hash where candidate documents are stored
     */
    function submitEntry(string memory _name,uint _members, string memory _ipfsHash)
    public onlyOngoingCampaign payable returns (bool entryStatus)  {
        require(msg.sender != electionCommission, "EC cannot be a candidate");
        require(!candidateChecker[_name], "Candidate has already registered");
        require(_members > 0, "Candidate party must have atleast 1 member");

        // Compute registration fee
        uint registrationFee = _members * memberFee;
        require(registrationFee == msg.value, "Insufficent registration fee");

        noOfCandidates++;
        candidates[noOfCandidates] = Candidate({
            candidateAddr: msg.sender,
            name: _name,
            noOfVotes: 0,
            stage: EntryStage.NOT_DECIDED,
            members: _members,
            ipfsHash: _ipfsHash
        });
        candidateChecker[_name] = true;

        // Tranfer fee to EC
        electionCommission.transfer(msg.value);

        return true;
    }

    /**
     * @dev Allows users to vote for a given candidate
     * @param _candidateId Id of the candidate to vote
     */
    function vote(uint _candidateId) public onlyOngoingCampaign returns (bool voted){
        require(!voters[msg.sender].voted,"Voter has already voted");
        assert(_candidateId > 0 && _candidateId <= noOfCandidates);
        require(candidates[_candidateId].stage == EntryStage.ACCEPT,
        "The candidate is not eligible for election");

        address voterAddr = msg.sender;
        voters[voterAddr].voted = true;
        candidates[_candidateId].noOfVotes++;
        noOfVoters++;

        return voters[voterAddr].voted;
    }

    /**
     * @dev Get winner of the election
     */
     function getWinner() public view returns (uint winningCandidateId) {
         require(noOfCandidates > 1, "No. of candidates should be atleast 2");

         // TODO : Handle draw case
         uint maxIndex = 0;
         uint maxVotes = 0;

         for(uint idx = 1; idx <= noOfCandidates; idx++) {
             // Check only eligible candidates
             if (candidates[idx].stage == EntryStage.ACCEPT && candidates[idx].noOfVotes > maxVotes) {
                 maxIndex = idx;
                 maxVotes = candidates[idx].noOfVotes;
             }
         }

        return maxIndex;
     }

    /**
     * @dev Provides summary of campaign
     */
     function getSummary() public view returns (
         uint candidateCount,
         uint noOfAcceptedCandidates,
         uint noOfRejectedCandidates,
         uint voterCount,
         uint fee,
         string memory name,
         bool status
    ) {
        return (
            noOfCandidates,
            acceptedCandidateCount,
            rejectedCandidateCount,
            noOfVoters,
            memberFee,
            campaignName,
            completed
        );
    }

}