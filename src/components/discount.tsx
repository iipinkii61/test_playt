import { Button, InputNumber, Row } from "antd";
import campaignData from "../data/campaign.json";
import { CampaignCategoryEnum, CampaignEnum } from "../enum/campaign.enum";
import { useEffect, useState } from "react";
import { ShoppingItemCategoryEnum } from "../enum/shopping-item.enum";

const defaultCampaignStorage = {
  [CampaignCategoryEnum.COUPON]: undefined,
  [CampaignCategoryEnum.ON_TOP]: undefined,
  [CampaignCategoryEnum.SEASONAL]: undefined,
};

const DiscountSection = (props) => {
  const { setDiscount, discount, basePrice, cart } = props;
  const [selectedCampaign, setSelectedCampaign] = useState(
    defaultCampaignStorage
  );
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    if (cart.length === 0) {
      setDiscount({
        item: [],
        discountValue: 0,
      });
      return;
    }

    const couponDiscount = couponHandler() || 0;
    const afterCoupon = basePrice - couponDiscount;

    const onTopDiscount = onTopHandler(afterCoupon) || 0;
    const afterOnTop = afterCoupon - onTopDiscount;

    const seasonalDiscount = seasonalHandler(afterOnTop) || 0;

    const totalDiscount = couponDiscount + onTopDiscount + seasonalDiscount;

    // FOR DEBUGGING
    // console.log("coupon", couponDiscount);
    // console.log("afterCoupon", afterCoupon);
    // console.log("onTop", onTopDiscount);
    // console.log("afterOnTop", afterOnTop);
    // console.log("seasonal", seasonalDiscount);

    // console.log("Total Discount:", totalDiscount, basePrice);

    if (totalDiscount > basePrice) {
      alert("Discount cannot exceed base price");
    } else {
      setDiscount({
        item: Object.values(selectedCampaign).filter((item) => item),
        discountValue: totalDiscount,
      });
    }
  }, [selectedCampaign, basePrice, points, cart]);

  const couponHandler = () => {
    const couponType = selectedCampaign[CampaignCategoryEnum.COUPON];
    if (!couponType) return 0;
    switch (couponType.name) {
      case CampaignEnum.FIXED_AMOUNT:
        return couponType.amount || 0;
      case CampaignEnum.PERCENTAGE:
        return basePrice * couponType.amount; // Assuming a 10% discount
      default:
        return;
    }
  };

  const onTopHandler = (price: number) => {
    const onTopType = selectedCampaign[CampaignCategoryEnum.ON_TOP];
    if (!onTopType) return 0;
    switch (onTopType.name) {
      case CampaignEnum.BY_CATEGORY:
        const clothingItems = cart.filter(
          (item) => item.category === ShoppingItemCategoryEnum.CLOTHING
        );
        const clothingTotal = clothingItems.reduce(
          (acc, item) => acc + item.price,
          0
        );
        return clothingTotal * onTopType.amount;

      case CampaignEnum.POINT:
        const maxDiscount = price * 0.2;
        return points > maxDiscount ? maxDiscount : points;
      default:
        return;
    }
  };

  const seasonalHandler = (price: number) => {
    const onSeasonalDiscount = selectedCampaign[CampaignCategoryEnum.SEASONAL];
    if (!onSeasonalDiscount) return 0;
    const roundToDiscount = Math.floor(price / onSeasonalDiscount.stepAmount);
    return roundToDiscount * onSeasonalDiscount.stepToDiscountAmount;
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ marginBottom: 0 }}>Points :</h1>
        <InputNumber
          style={{ width: "200px", marginLeft: "10px" }}
          type="number"
          value={points}
          onChange={(value) => setPoints(value)}
        />
        <Button
          type="primary"
          onClick={() => setPoints(0)}
          style={{ marginInline: "10px" }}
        >
          reset
        </Button>
        <p style={{ marginBottom: 0, fontSize: "12px" }}>
          points can be used up to 20% of total price (before discount)
        </p>
      </div>
      <Row>
        {campaignData.map((campaign, index) => (
          <div key={index} style={{ background: "white", padding: "20px" }}>
            <p>
              {campaign.name} {campaign.amount ? `${campaign.amount}` : ""}
            </p>
            {Object.values(selectedCampaign)
              .map((item) => item?.id)
              .includes(campaign?.id) ? (
              <Button
                onClick={() =>
                  setSelectedCampaign((prev) => ({
                    ...prev,
                    [campaign.categories]: undefined,
                  }))
                }
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
                disabled={cart.length === 0}
              >
                Claim
              </Button>
            )}
          </div>
        ))}
      </Row>
    </div>
  );
};

export default DiscountSection;
