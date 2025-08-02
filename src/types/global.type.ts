import { CampaignCategoryEnum, CampaignEnum } from "../enum/campaign.enum";

export type DiscountType = {
  item: CampaignDataType[];
  discountValue: number;
};

export type CartType = {
  name: string;
  category: string;
  price: number;
};

export type CampaignDataType = {
  id: string;
  name: string;
  categories: CampaignCategoryEnum;
  amount?: number;
  stepAmount?: number;
  stepToDiscountAmount?: number;
};

export type DiscountComponentPropsType = {
  setDiscount: (discount: DiscountType) => void;
  basePrice: number;
  cart: CartType[];
};

export type CampaignSelectedType = {
  [key in CampaignCategoryEnum]?: CampaignDataType;
};
