/**
 * Contains form validators
 */

export const validateCampaignName = (rule, value, cb) => {
  if (value.length < 6) {
    cb("Campaign name should have atleast 6 characters");
  } else {
    cb();
  }
};

export const validateMemberFee = (rule, value, cb) => {
  if (value.length <= 0 || parseInt(value) <= 0) {
    cb("Fee should be greater than 0");
  } else {
    cb();
  }
};
