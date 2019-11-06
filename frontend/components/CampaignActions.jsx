import { Button, Row, Col, Divider, message } from "antd";

const copyLink = action => {
  // https://{sitename}.com/register?id={campaign_address}
  const link = `${location.origin}/${action}${location.search}`;

  navigator.clipboard.writeText(link);
  message.success("Copied link", 1.5);
};

const CampaignActions = ({ handleClick, getWinner }) => {
  return (
    <>
      <div className="actions-container">
        <Row>
          <Col span={18}>
            <h3 className="action-header">Registration link</h3>
            <h4 className="action-text">
              Link to be used by candidates to submit entries
            </h4>
          </Col>
          <Col span={6}>
            <div className="btn-container">
              <Button
                style={{ marginTop: "10px" }}
                icon="copy"
                onClick={() => copyLink("register")}>
                Copy link
              </Button>
            </div>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0", background: "#CBD5E0" }} />
        <Row>
          <Col span={18}>
            <h3 className="action-header">Voting link</h3>
            <h4 className="action-text">
              Link to be used by voters to vote for candidates
            </h4>
          </Col>
          <Col span={6}>
            <div className="btn-container">
              <Button
                style={{ marginTop: "10px" }}
                icon="copy"
                onClick={() => copyLink("vote")}>
                Copy link
              </Button>
            </div>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0", background: "#CBD5E0" }} />
        <Row>
          <Col span={18}>
            <h3 className="action-header">Declare winner</h3>
            <h4 className="action-text">Get winner</h4>
          </Col>
          <Col span={6}>
            <div className="btn-container">
              <Button style={{ marginTop: "10px" }} onClick={() => getWinner()}>
                Declare
              </Button>
            </div>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0", background: "#CBD5E0" }} />
        <Row>
          <Col span={18}>
            <h3 className="action-header">Close campaign</h3>
            <h4 className="action-text">
              This action is irreversible. You won't be able to open the
              campaign again
            </h4>
          </Col>
          <Col span={6}>
            <div className="btn-container">
              <Button
                style={{ marginTop: "10px" }}
                icon="close"
                type="danger"
                onClick={() => handleClick()}>
                Close
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .actions-container {
          border: 1.2px solid #cbd5e0;
          border-radius: 5px;
          padding: 10px;
          margin: 20px 0;
        }

        .action-header {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .action-text {
          margin-bottom: 5px;
        }

        .btn-container {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default CampaignActions;
