import { Card, Badge, Button } from "antd";
import Link from "next/link";

const CampaignListItem = ({ campaign }) => {
  return (
    <Card
      actions={[
        <Link
          href={{
            pathname: "/campaigns",
            query: { id: campaign.address }
          }}>
          <Button>View more</Button>
        </Link>
      ]}
      extra={
        <Badge
          status="processing"
          text={campaign.status}
          style={{ color: "white" }}
          color={campaign.completed ? "green" : ""}
        />
      }
      headStyle={{
        background: "#1A202C",
        color: "#E2E8F0"
      }}
      hoverable
      title={campaign.name}>
      <p>
        <strong>Deployed at</strong> : {campaign.address}
      </p>
    </Card>
  );
};

export default CampaignListItem;
