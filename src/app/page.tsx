"use client";

import React, { useEffect, useState } from "react";
import ShoppingList from "../components/shopping-list";
import DiscountSection from "../components/discount";
import { Card, Divider } from "antd";
import { CartType, DiscountType } from "../types/global.type";

const Page = () => {
  const [basePrice, setBasePrice] = useState<number>(0);
  const [discount, setDiscount] = useState<DiscountType>({
    item: [],
    discountValue: 0,
  });
  const [cart, setCart] = useState<CartType[]>([]);

  useEffect(() => {
    const price = cart
      .map((item: CartType) => item.price)
      .reduce((acc, curr) => acc + curr, 0);
    setBasePrice(price);
  }, [cart]);

  return (
    <div
      style={{
        backgroundColor: "#DBE4C9",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <ShoppingList setCart={setCart} />
      <Divider />
      <DiscountSection
        setDiscount={setDiscount}
        basePrice={basePrice}
        cart={cart}
      />
      <Divider />
      <Card title="Summary" style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "20px" }}>Price : {basePrice}</p>
        <p style={{ fontSize: "20px" }}>
          Discount : {discount.discountValue || 0}
        </p>
        <p style={{ fontSize: "30px" }}>
          Total Price : {basePrice - discount.discountValue}
        </p>
      </Card>
    </div>
  );
};

export default Page;
