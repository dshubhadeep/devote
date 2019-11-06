import { Spin } from "antd";
import { useEffect, useState } from "react";

import CampaignListItem from "./CampaignListItem";

import factory from "../../utils/factory";
import generateCampaignInstance from "../../utils/campaign";

// Extremely bad practice. Try to improve
const getCampaignData = async noOfCampaigns => {
  const campaigns = await Promise.all(
    Array(noOfCampaigns)
      .fill(0)
      .map(async (el, idx) => {
        // Get campaign details
        const campaign = await factory.methods.getCampaign(idx + 1).call();
        const instance = generateCampaignInstance(campaign["0"]);

        const completed = await instance.methods.completed().call();

        return {
          address: campaign["0"],
          name: campaign["1"],
          status: completed ? "Completed" : "Ongoing",
          completed
        };
      })
  );

  return campaigns;
};

const CampaignList = () => {
  const [campaignCount, setCampaignCount] = useState(0);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getCampaigns = async () => {
      const noOfCampaigns = await factory.methods.noOfCampaigns().call();
      const campaignData = await getCampaignData(Number(noOfCampaigns));

      console.log("campaigns", noOfCampaigns);

      if (isMounted) {
        setCampaignCount(noOfCampaigns);
        setCampaigns(campaignData);
      }
    };

    getCampaigns();

    return () => {
      /**
       * Cleanup
       * @see https://github.com/facebook/react/issues/14369
       */
      isMounted = false;
    };
  });

  return (
    <>
      <div style={{ margin: "12px 0 24px 0" }}>
        <h3 style={{ color: "#2D3748" }}>
          Found <strong>{campaignCount}</strong> campaign
          {campaignCount > 1 ? "s" : ""}.
        </h3>
      </div>

      {campaigns.length == campaignCount ? (
        <div className="card-grid">
          {campaigns.map(campaign => (
            <CampaignListItem campaign={campaign} key={campaign.address} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}>
          <Spin />
        </div>
      )}

      <style jsx>{`
        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-column-gap: 50px;
          grid-row-gap: 50px;
        }
      `}</style>
    </>
  );
};

export default CampaignList;
