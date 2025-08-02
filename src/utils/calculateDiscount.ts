import { CampaignCategoryEnum, CampaignEnum } from "../enum/campaign.enum";
import { ShoppingItemCategoryEnum } from "../enum/shopping-item.enum";

export const finalPriceCaculate = (props) => {
  const { basePrice, selectedCampaign, cart, point } = props;
  const couponDiscount = couponHandler(selectedCampaign, basePrice) || 0;
  const afterCoupon = basePrice - couponDiscount;

  const onTopDiscount =
    onTopHandler(afterCoupon, selectedCampaign, cart, point) || 0;
  const afterOnTop = afterCoupon - onTopDiscount;

  const seasonalDiscount = seasonalHandler(afterOnTop, selectedCampaign) || 0;

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
    return totalDiscount;
  }
};

export const couponHandler = (selectedCampaign, basePrice) => {
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

export const onTopHandler = (price: number, selectedCampaign, cart, points) => {
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

export const seasonalHandler = (price: number, selectedCampaign) => {
  const onSeasonalDiscount = selectedCampaign[CampaignCategoryEnum.SEASONAL];
  if (!onSeasonalDiscount) return 0;
  const roundToDiscount = Math.floor(price / onSeasonalDiscount.stepAmount);
  return roundToDiscount * onSeasonalDiscount.stepToDiscountAmount;
};
