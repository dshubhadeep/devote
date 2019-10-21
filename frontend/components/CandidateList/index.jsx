import { Table } from "antd";

const data = [
  {
    key: "1",
    name: "BJP",
    members: 32,
    status: "Approved",
    docLink: "ipfsHash"
  },
  {
    key: "2",
    name: "Congress",
    members: 42,
    status: "Rejected",
    docLink: "ipfsHash"
  }
];

const columns = [
  {
    title: "Candidate Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Members",
    dataIndex: "members",
    key: "members"
  },
  {
    title: "Entry status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Document link",
    dataIndex: "docLink",
    key: "docLink"
  }
];

const CandidateList = ({ candidateCount }) => {
  return (
    <div style={{ marginTop: "18px", marginBottom: "32px" }}>
      {candidateCount > 0 ? (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered={true}
        />
      ) : (
        <p>No candidates found</p>
      )}
    </div>
  );
};

export default CandidateList;
