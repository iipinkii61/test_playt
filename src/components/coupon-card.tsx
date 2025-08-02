import { Button } from "antd";
import { CampaignDataType } from "../types/global.type";
import { CampaignEnum } from "../enum/campaign.enum";

const CouponCard = (props) => {
  const { campaign, selectedCampaign, setSelectedCampaign, cart } = props;

  const couponLabelHandler = () => {
    switch (campaign.name) {
      case CampaignEnum.PERCENTAGE:
        return `Discount ${campaign.amount * 100}%`;
      case CampaignEnum.FIXED_AMOUNT:
        return `Discount ${campaign.amount} THB`;
      case CampaignEnum.BY_CATEGORY:
        return `Discount on ${campaign.item_category} ${
          campaign.amount * 100
        }%`;
      case CampaignEnum.POINT:
        return "Use point";
      case CampaignEnum.SEASONAL:
        return `Special Discount : ${campaign.stepToDiscountAmount} THB for every ${campaign.stepAmount} THB spent`;
      default:
        return "Coupon";
    }
  };

  return (
    <div className="coupon-card">
      <p>{couponLabelHandler()}</p>
      {Object.values(selectedCampaign)
        .map((item: CampaignDataType) => item?.id.toString())
        .includes(campaign?.id.toString()) ? (
        <Button
          onClick={() =>
            setSelectedCampaign((prev) => ({
              ...prev,
              [campaign.categories]: undefined,
            }))
          }
          type="dashed"
          disabled={cart.length === 0}
        >
          Remove
        </Button>
      ) : (
        <Button
          onClick={() =>
            setSelectedCampaign((prev) => ({
              ...prev,
              [campaign.categories]: campaign,
            }))
          }
          type="primary"
          disabled={cart.length === 0}
        >
          Claim
        </Button>
      )}
    </div>
  );
};

export default CouponCard;
