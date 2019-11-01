import { useState } from "react";
import { Button } from "antd";

const VotingCandidateList = ({ candidates, onVote }) => {
  const [selectedCandidate, setselectedCandidate] = useState(0);

  return (
    <>
      {candidates.map((candidate, idx) => {
        return (
          <div
            className={`candidate_container ${
              selectedCandidate === idx + 1 ? "selected" : ""
            }`}
            onClick={() => setselectedCandidate(idx + 1)}>
            <h2>{candidate.name}</h2>
          </div>
        );
      })}

      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          size="large"
          onClick={() => onVote(selectedCandidate)}
          disabled={selectedCandidate === 0}>
          Vote
        </Button>
      </div>

      <style jsx>{`
        .candidate_container {
          background-color: white;
          height: 72px;
          margin: 16px 4.5em;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h2 {
          margin: 0;
        }

        .selected {
          border: 2px solid rgb(74, 85, 104);
        }
      `}</style>
    </>
  );
};

export default VotingCandidateList;
