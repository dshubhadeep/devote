import { Button, Form, Input, message } from "antd";

import web3 from "../../utils/web3";
import generateCampaignInstance from "../../utils/campaign";

const EntryForm = ({ address, form, memberFee }) => {
  const { getFieldDecorator } = form;

  // Submit handler
  const handleSubmit = async event => {
    event.preventDefault();
    form.validateFields(async (err, val) => {
      if (err) {
        message.error("Fill all the fields");
      } else {
        const campaign = generateCampaignInstance(address);

        const regFee =
          Number(web3.utils.fromWei(memberFee, "micro")) * val.member_cnt;
        console.log(campaign, regFee, window.ethereum.selectedAddress);

        try {
          await campaign.methods
            .submitEntry(val.candidate_name, Number(val.member_cnt), "hash")
            .send({
              from: window.ethereum.selectedAddress,
              value: web3.utils.toWei(regFee.toString(), "micro"),
              gas: "2000000"
            });

          message.success("Entry submitted");
        } catch (err) {
          message.error(err.message);
        }
      }
    });
  };

  const handleMemberCountChange = e => {
    const totalFee = web3.utils.fromWei(memberFee, "microether");
    const memberCount = e.currentTarget.value;

    form.setFieldsValue({
      total_reg_fee: totalFee * memberCount
    });
  };

  return (
    <div
      style={{
        background: "#fff",
        boxShadow: "0px 0px 20px -9px rgba(0,0,0,0.74)",
        padding: "30px 60px"
      }}>
      <Form className="entry-form" onSubmit={handleSubmit}>
        <Form.Item label="Candidate Name" hasFeedback>
          {getFieldDecorator("candidate_name", {
            rules: [
              {
                min: 1,
                required: true,
                message: "Name should have atleast 1 character"
              }
            ]
          })(<Input size="large" placeholder="BJP" />)}
        </Form.Item>
        <Form.Item label="Members">
          {getFieldDecorator("member_cnt", {
            rules: [
              {
                required: true,
                pattern: /^[1-9][0-9]*$/,
                message: "Please enter the no. of members"
              }
            ]
          })(
            <Input
              type="number"
              placeholder="1"
              size="large"
              onChange={handleMemberCountChange}
            />
          )}
        </Form.Item>
        <Form.Item label="Registration Fee">
          {getFieldDecorator("total_reg_fee", {})(
            <Input
              placeholder={web3.utils.fromWei(memberFee, "microether")}
              size="large"
              disabled
            />
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Button type="primary" htmlType="submit" size="large">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const WrappedEntryForm = Form.create({
  name: "entry_form"
})(EntryForm);

export default WrappedEntryForm;
