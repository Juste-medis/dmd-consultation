import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getProductsQuantity } from 'helpers/utils';
import { productData } from 'data/ecommerce/productData';

const CartNotification = () => {
  const cartItems = [
    {
      ...productData[0],
      quantity: 3,
      totalPrice: productData[0].price * 3
    },
    {
      ...productData[1],
      quantity: 3,
      totalPrice: productData[1].price * 3
    },
    { ...productData[2], quantity: 3, totalPrice: productData[2].price * 3 }
  ];

  return (
    <Nav.Item>
      <Nav.Link
        as={Link}
        to="/e-commerce/shopping-cart"
        className={classNames('px-0', {
          'notification-indicator notification-indicator-warning notification-indicator-fill':
            getProductsQuantity(cartItems)
        })}
      >
        <span className="notification-indicator-number">
          {getProductsQuantity(cartItems)}
        </span>
        <FontAwesomeIcon
          icon="shopping-cart"
          transform="shrink-7"
          className="fs-4"
        />
      </Nav.Link>
    </Nav.Item>
  );
};

export default CartNotification;
