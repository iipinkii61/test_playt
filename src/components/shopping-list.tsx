import { Card, Checkbox, Col, Row } from "antd";
import shoppingItem from "../data/shopping-item.json";

const ShoppingList = (props) => {
  const { setCart } = props;
  return (
    <>
      <Row gutter={16}>
        {shoppingItem.map((item, index) => (
          <Col key={index}>
            <Card key={index} title={item.categories} style={{ width: 300 }}>
              {item.items.map((subItem) => (
                <div key={subItem.id}>
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCart((prev) => [
                          ...prev,
                          {
                            name: subItem.name,
                            category: item.categories,
                            price: subItem.price,
                          },
                        ]);
                      } else {
                        setCart((prev) =>
                          prev.filter(
                            (cartItem) =>
                              cartItem.name !== subItem.name &&
                              cartItem.category !== item.categories
                          )
                        );
                      }
                    }}
                  >
                    {subItem.name} - {subItem.price} THB
                  </Checkbox>
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ShoppingList;
