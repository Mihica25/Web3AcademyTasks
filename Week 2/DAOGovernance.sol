// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DAOMembershipNFT.sol"; 

contract DAOGovernance {
    DAOMembershipNFT public nft;

    enum VotingChoice { For, Against, Abstain }

    struct Vote {
        VotingChoice choice;
        uint256 timestamp;
        string reason;
    }

    struct Proposal {
        address proposalCreator;
        string description;
        uint256 deadline;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        bool executed;
    }

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => Vote[]) public proposalVotes;

    event ProposalCreated(uint256 id, string description);
    event Voted(uint256 id, address voter, VotingChoice choice);
    event ProposalExecuted(uint256 id);

    constructor(address nftAddress) {
        nft = DAOMembershipNFT(nftAddress);
    }

    modifier onlyMember() {
        require(nft.balanceOf(msg.sender) > 0, "Not a DAO member");
        _;
    }

    function createProposal(string calldata description) external onlyMember {
        proposals.push(Proposal({
            proposalCreator: msg.sender,
            description: description,
            deadline: block.timestamp + 7 days,
            votesFor: 0,
            votesAgainst: 0,
            votesAbstain: 0,
            executed: false
        }));
        emit ProposalCreated(proposals.length - 1, description);
    }

    function vote(uint256 proposalId, VotingChoice choice, string calldata reason) external onlyMember {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;

        if (choice == VotingChoice.For) {
            proposal.votesFor++;
        } else if (choice == VotingChoice.Against) {
            proposal.votesAgainst++;
        } else if (choice == VotingChoice.Abstain) {
            proposal.votesAbstain++;
        }

        proposalVotes[proposalId].push(Vote({
            choice: choice,
            timestamp: block.timestamp,
            reason: reason
        }));

        emit Voted(proposalId, msg.sender, choice);
    }

    function executeProposal(uint256 proposalId) external onlyMember {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.deadline, "Voting ongoing");
        require(!proposal.executed, "Already executed");

        if (proposal.votesFor > proposal.votesAgainst + proposal.votesAbstain) {
            proposal.executed = true;
            emit ProposalExecuted(proposalId);
        }
    }

    function getProposalsCount() external view returns (uint256) {
        return proposals.length;
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }

    function getVotes(uint256 proposalId) external view returns (Vote[] memory) {
        return proposalVotes[proposalId];
    }
}
