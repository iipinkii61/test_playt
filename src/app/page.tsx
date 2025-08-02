"use client";

import React, { useEffect, useState } from "react";
import ShoppingList from "../components/shopping-list";
import DiscountSection from "../components/discount-main";
import { Card, Col, Divider, Row, Typography } from "antd";
import { CartType, DiscountType } from "../types/global.type";

const Page = () => {
  const { Title } = Typography;
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
    <div className="main-container">
      <Row>
        <Col xs={24} sm={12} style={{ padding: "24px" }}>
          <ShoppingList setCart={setCart} />
        </Col>
        <Col
          xs={24}
          sm={12}
          style={{ background: "#5E936C", padding: "24px", minHeight: "100vh" }}
        >
          <DiscountSection
            setDiscount={setDiscount}
            basePrice={basePrice}
            cart={cart}
          />
          <Divider />
          <Card title="Summary" style={{ marginTop: "20px" }}>
            <Title level={4}>Price : {basePrice}.-</Title>
            <Title level={4} style={{ color: "#5E936C" }}>
              Discount : {discount.discountValue || 0}.-
            </Title>
            <Title level={2}>
              Total Price : {basePrice - discount.discountValue}.-
            </Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Page;
