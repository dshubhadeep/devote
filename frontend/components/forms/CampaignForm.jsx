import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import Router from "next/router";

import { validateMemberFee } from "../../utils/validators";

import factory from "../../utils/factory";
import web3 from "../../utils/web3";

const CampaignForm = props => {
  const { form } = props;
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    form.validateFields(async (err, val) => {
      if (err) {
        message.error("Errors are present", 2);
      } else {
        setLoading(true);

        const accounts = await web3.eth.getAccounts();

        try {
          await factory.methods
            .createCampaign(
              web3.utils.toWei(val.member_fee, "micro"),
              val.campaign_name
            )
            .send({
              from: accounts[0],
              gas: "2000000"
            });

          message.success("Campaign created", 3);

          // Wait for some time to redirect to main page
          setTimeout(() => {
            Router.push("/");
          }, 2000);
        } catch (err) {
          message.error(err.message, 3);
        }

        setLoading(false);
      }
    });
  };

  return (
    <div>
      <Form className="campaign-form" onSubmit={handleSubmit}>
        <Form.Item label="Campaign Name" hasFeedback>
          {getFieldDecorator("campaign_name", {
            rules: [
              {
                min: 6,
                required: true,
                message: "Campaign name should have atleast 6 characters"
              }
            ]
          })(<Input size="large" placeholder="Campaign 1" />)}
        </Form.Item>
        <Form.Item label="Min. member fee">
          {getFieldDecorator("member_fee", {
            rules: [
              {
                validator: validateMemberFee
              }
            ]
          })(
            <Input
              addonAfter="microether"
              type="number"
              placeholder="Amount"
              size="large"
            />
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const WrappedCampaignForm = Form.create({
  name: "campaign_form"
})(CampaignForm);

export default WrappedCampaignForm;
