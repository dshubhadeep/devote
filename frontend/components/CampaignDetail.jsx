import { Card, Statistic } from "antd";

import web3 from "../utils/web3";

const CampaignDetail = ({ summary }) => {
  return (
    <div className="stats-grid">
      <Card hoverable>
        <Statistic
          title="Member fee"
          value={web3.utils.fromWei(summary.fee, "micro")}
          suffix="microether"
        />
      </Card>
      <Card hoverable>
        <Statistic title="Candidates" value={summary.candidateCount} />
      </Card>
      <Card hoverable>
        <Statistic
          title="Accepted candidates"
          value={summary.noOfAcceptedCandidates}
        />
      </Card>
      <Card hoverable>
        <Statistic
          title="Rejected candidates"
          value={summary.noOfRejectedCandidates}
        />
      </Card>
      <Card hoverable>
        <Statistic title="Voters" value={summary.voterCount} />
      </Card>

      <style jsx>{`
        .stats-grid {
          margin-top: 18px;
          margin-bottom: 32px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-column-gap: 60px;
        }
      `}</style>
    </div>
  );
};

export default CampaignDetail;
