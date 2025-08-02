import { Button, Col, InputNumber, Row, Tooltip } from "antd";
import campaignData from "../data/campaign.json";
import { CampaignCategoryEnum } from "../enum/campaign.enum";
import { useEffect, useState } from "react";
import { finalPriceCalculate } from "../utils/calculateDiscount";
import {
  CampaignSelectedType,
  DiscountComponentPropsType,
} from "../types/global.type";
import CouponCard from "./coupon-card";

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

    const props = { basePrice, selectedCampaign, cart, points };

    const totalDiscount = finalPriceCalculate(props);

    if (!totalDiscount) {
      setDiscount({
        item: [],
        discountValue: 0,
      });
      setSelectedCampaign(defaultCampaignStorage);
    } else {
      setDiscount({
        item: Object.values(selectedCampaign).filter((item) => item),
        discountValue: totalDiscount,
      });
    }
  }, [selectedCampaign, basePrice, points, cart]);

  return (
    <div>
      <div className="point-container">
        <h1 style={{ marginBottom: 0 }}>Points :</h1>
        <Tooltip title="points can be used up to 20% of total price (after discount)">
          <InputNumber
            style={{ width: "100px", marginLeft: "10px" }}
            type="number"
            value={points}
            onChange={(value) => setPoints(value)}
          />
        </Tooltip>
        <Button
          type="primary"
          onClick={() => setPoints(0)}
          style={{ marginInline: "10px" }}
        >
          reset
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        {campaignData.map((campaign, index) => (
          <Col span={8} key={index}>
            <CouponCard
              campaign={campaign}
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
              cart={cart}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DiscountSection;
