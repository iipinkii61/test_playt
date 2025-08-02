import { CampaignCategoryEnum, CampaignEnum } from "../enum/campaign.enum";
import { ShoppingItemCategoryEnum } from "../enum/shopping-item.enum";
import {
  couponHandler,
  finalPriceCaculate,
  onTopHandler,
  seasonalHandler,
} from "./calculateDiscount";

describe("finalPriceCaculate", () => {
  const baseCart = [
    { name: "Shirt", price: 500, category: ShoppingItemCategoryEnum.CLOTHING },
    { name: "Hat", price: 200, category: ShoppingItemCategoryEnum.ACCESSORIES },
  ];

  it("calculates coupon discount only", () => {
    const result = finalPriceCaculate({
      basePrice: 700,
      cart: baseCart,
      point: 0,
      selectedCampaign: {
        [CampaignCategoryEnum.COUPON]: {
          name: CampaignEnum.FIXED_AMOUNT,
          amount: 100,
        },
        [CampaignCategoryEnum.ON_TOP]: undefined,
        [CampaignCategoryEnum.SEASONAL]: undefined,
      },
    });

    expect(result).toBe(100);
  });

  it("calculates point discount only", () => {
    const result = finalPriceCaculate({
      basePrice: 700,
      cart: baseCart,
      point: 10,
      selectedCampaign: {
        [CampaignCategoryEnum.COUPON]: undefined,
        [CampaignCategoryEnum.ON_TOP]: {
          name: CampaignEnum.POINT,
        },
        [CampaignCategoryEnum.SEASONAL]: undefined,
      },
    });

    expect(result).toBe(10);
  });

  it("calculates seasonal discount only", () => {
    const result = finalPriceCaculate({
      basePrice: 700,
      cart: baseCart,
      point: 0,
      selectedCampaign: {
        [CampaignCategoryEnum.COUPON]: undefined,
        [CampaignCategoryEnum.ON_TOP]: undefined,
        [CampaignCategoryEnum.SEASONAL]: {
          name: CampaignEnum.SEASONAL,
          stepAmount: 400,
          stepToDiscountAmount: 80,
        },
      },
    });

    expect(result).toBe(80);
  });

  it("calculates all discount types", () => {
    const result = finalPriceCaculate({
      basePrice: 1000,
      cart: baseCart,
      point: 10,
      selectedCampaign: {
        [CampaignCategoryEnum.COUPON]: {
          name: CampaignEnum.PERCENTAGE,
          amount: 0.5,
        },
        [CampaignCategoryEnum.ON_TOP]: {
          name: CampaignEnum.POINT,
        },
        [CampaignCategoryEnum.SEASONAL]: {
          name: CampaignEnum.SEASONAL,
          stepAmount: 200,
          stepToDiscountAmount: 30,
        },
      },
    });

    expect(result).toBe(570);
  });

  it("applied 2 campaign: coupon and on-top discount", () => {
    const result = finalPriceCaculate({
      basePrice: 1000,
      cart: baseCart,
      point: 0,
      selectedCampaign: {
        [CampaignCategoryEnum.COUPON]: {
          name: CampaignEnum.FIXED_AMOUNT,
          amount: 100,
        },
        [CampaignCategoryEnum.ON_TOP]: {
          name: CampaignEnum.BY_CATEGORY,
          amount: 0.5,
        },
        [CampaignCategoryEnum.SEASONAL]: undefined,
      },
    });

    expect(result).toBe(350);
  });

  it("applied 2 campaign: coupon and seasonal discount", () => {
    const result = finalPriceCaculate({
      basePrice: 1000,
      cart: baseCart,
      point: 0,
      selectedCampaign: {
        [CampaignCategoryEnum.COUPON]: {
          name: CampaignEnum.FIXED_AMOUNT,
          amount: 100,
        },
        [CampaignCategoryEnum.ON_TOP]: undefined,
        [CampaignCategoryEnum.SEASONAL]: {
          name: CampaignEnum.SEASONAL,
          stepAmount: 200,
          stepToDiscountAmount: 50,
        },
      },
    });

    expect(result).toBe(300);
  });

  it("applied 2 campaign: on-top and seasonal discount", () => {
    const result = finalPriceCaculate({
      basePrice: 1000,
      cart: baseCart,
      point: 0,
      selectedCampaign: {
        [CampaignCategoryEnum.COUPON]: undefined,
        [CampaignCategoryEnum.ON_TOP]: {
          name: CampaignEnum.BY_CATEGORY,
          amount: 0.5,
        },
        [CampaignCategoryEnum.SEASONAL]: {
          name: CampaignEnum.SEASONAL,
          stepAmount: 200,
          stepToDiscountAmount: 50,
        },
      },
    });

    expect(result).toBe(400);
  });
});

describe("couponHandler", () => {
  it("returns 0 if no coupon is selected", () => {
    const result = couponHandler({}, 1000);
    expect(result).toBe(0);
  });
});

describe("onTopHandler", () => {
  const cart = [
    {
      name: "Shirt",
      price: 500,
      category: ShoppingItemCategoryEnum.ELECTRONICS,
    },
    { name: "Hat", price: 200, category: ShoppingItemCategoryEnum.ACCESSORIES },
  ];

  it("returns 0 if no on-top campaign is selected", () => {
    const result = onTopHandler(1000, {}, [], 0);
    expect(result).toBe(0);
  });

  it("returns 0 if no campaign's category is selected", () => {
    const result = onTopHandler(
      1000,
      {
        [CampaignCategoryEnum.ON_TOP]: {
          name: CampaignEnum.BY_CATEGORY,
          amount: 0.7,
        },
      },
      cart,
      0
    );
    expect(result).toBe(0);
  });

  it("returns input point if less than 20% total price", () => {
    const result = onTopHandler(
      1000,
      {
        [CampaignCategoryEnum.ON_TOP]: {
          name: CampaignEnum.POINT,
        },
      },
      cart,
      10
    );
    expect(result).toBe(10);
  });

  it("returns maximum point (20% of price) if input points is more than maximum point", () => {
    const result = onTopHandler(
      1000,
      {
        [CampaignCategoryEnum.ON_TOP]: {
          name: CampaignEnum.POINT,
        },
      },
      cart,
      500
    );
    expect(result).toBe(200);
  });
});

describe("onSeasonalHandler", () => {
  it("returns 0 if no seasonal campaign is selected", () => {
    const result = seasonalHandler(1000, []);
    expect(result).toBe(0);
  });

  it("returns 0 if price is not reach the step price", () => {
    const result = seasonalHandler(1000, [
      {
        name: CampaignEnum.SEASONAL,
        stepAmount: 2000,
        stepToDiscountAmount: 50,
      },
    ]);
    expect(result).toBe(0);
  });
});
