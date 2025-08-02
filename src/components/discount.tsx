import { Button, InputNumber, Row } from "antd";
import campaignData from "../data/campaign.json";
import { CampaignCategoryEnum } from "../enum/campaign.enum";
import { useEffect, useState } from "react";
import { finalPriceCaculate } from "../utils/calculateDiscount";
import {
  CampaignSelectedType,
  DiscountComponentPropsType,
} from "../types/global.type";

const defaultCampaignStorage = {
  [CampaignCategoryEnum.COUPON]: undefined,
  [CampaignCategoryEnum.ON_TOP]: undefined,
  [CampaignCategoryEnum.SEASONAL]: undefined,
};

const DiscountSection = (props: DiscountComponentPropsType) => {
  const { setDiscount, basePrice, cart } = props;
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignSelectedType>(defaultCampaignStorage);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    if (cart.length === 0) {
      setDiscount({
        item: [],
        discountValue: 0,
      });
      return;
    }

    const props = { setDiscount, basePrice, selectedCampaign, cart, points };

    const totalDiscount = finalPriceCaculate(props);
    setDiscount({
      item: Object.values(selectedCampaign).filter((item) => item),
      discountValue: totalDiscount,
    });
  }, [selectedCampaign, basePrice, points, cart]);

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
          points can be used up to 20% of total price (after discount)
        </p>
      </div>
      <Row>
        {campaignData.map((campaign, index) => (
          <div key={index} style={{ background: "white", padding: "20px" }}>
            <p>
              {campaign.name} {campaign.amount ? `${campaign.amount}` : ""}
            </p>
            {Object.values(selectedCampaign)
              .map((item) => item?.id.toString())
              .includes(campaign?.id.toString()) ? (
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
