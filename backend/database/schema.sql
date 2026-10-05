-- =====================================================================
-- HungryHub Database Schema (PostgreSQL)
-- Based on: 23CSE202 DBMS Design Document (Section 3.3 Relational Schema)
--
-- This keeps every entity/relationship from the design doc, and adds a
-- small number of columns/tables that the actual React frontend needs
-- but the doc didn't model (marked "EXTENSION" below). These are the
-- same kind of refinement the doc itself made when it split PAYMENT
-- and DELIVERY out of ORDERS.
-- =====================================================================

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for password hashing (crypt/gen_salt)

-- ---------------------------------------------------------------------
-- RESTAURANT  (created before USER/STAFF because STAFF references it)
-- ---------------------------------------------------------------------
CREATE TABLE restaurant (
  restaurant_id      SERIAL PRIMARY KEY,
  name               VARCHAR(100) NOT NULL,
  cuisine_types      TEXT[] NOT NULL DEFAULT '{}',      -- EXTENSION: doc had single CuisineType
  address            VARCHAR(150) NOT NULL,
  city               VARCHAR(50)  NOT NULL,
  contact_number     VARCHAR(20),
  rating             NUMERIC(2,1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count       INT DEFAULT 0,                     -- EXTENSION
  delivery_time_text VARCHAR(20),                       -- e.g. "20-30 min" (doc had AvgDeliveryTime INT minutes)
  distance_text      VARCHAR(20),                        -- EXTENSION, display only
  price_for_two      NUMERIC(8,2),                       -- EXTENSION
  image_url          TEXT,                               -- EXTENSION
  banner_image_url    TEXT,                              -- EXTENSION
  is_free_delivery   BOOLEAN DEFAULT FALSE,               -- EXTENSION
  discount_badge     VARCHAR(60),                         -- EXTENSION
  tags               TEXT[] DEFAULT '{}',                 -- EXTENSION
  is_open            BOOLEAN DEFAULT TRUE,                 -- EXTENSION (live open/closed)
  is_active          BOOLEAN DEFAULT TRUE
);

-- ---------------------------------------------------------------------
-- USER (disjoint, total specialisation into CUSTOMER/STAFF/DELIVERY_PARTNER/ADMIN)
-- Named app_user because USER is a reserved word in PostgreSQL.
-- ---------------------------------------------------------------------
CREATE TABLE app_user (
  user_id       SERIAL PRIMARY KEY,
  name          VARCHAR(80)  NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL CHECK (role IN ('Customer','Staff','DeliveryPartner','Admin')),
  avatar_url    TEXT,                                     -- EXTENSION, used by UI avatars
  created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE customer (
  user_id        INT PRIMARY KEY REFERENCES app_user(user_id) ON DELETE CASCADE,
  wallet_balance NUMERIC(10,2) NOT NULL DEFAULT 0          -- EXTENSION (frontend shows a wallet)
);

-- EXTENSION: doc modelled Address/City as two flat columns on CUSTOMER;
-- the UI needs a customer to have several saved addresses (Home/Office...),
-- so that becomes its own table.
CREATE TABLE customer_address (
  address_id   SERIAL PRIMARY KEY,
  customer_id  INT NOT NULL REFERENCES customer(user_id) ON DELETE CASCADE,
  title        VARCHAR(40) NOT NULL,
  address_line VARCHAR(150) NOT NULL,
  city         VARCHAR(50) NOT NULL,
  zip_code     VARCHAR(10),
  is_default   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE staff (
  user_id       INT PRIMARY KEY REFERENCES app_user(user_id) ON DELETE CASCADE,
  restaurant_id INT NOT NULL REFERENCES restaurant(restaurant_id),
  designation   VARCHAR(40)
);

CREATE TABLE delivery_partner (
  user_id              INT PRIMARY KEY REFERENCES app_user(user_id) ON DELETE CASCADE,
  vehicle_type         VARCHAR(20),
  vehicle_number       VARCHAR(20),
  availability_status  VARCHAR(15) NOT NULL DEFAULT 'Available'
                       CHECK (availability_status IN ('Available','Unavailable','OnDelivery'))
);

CREATE TABLE admin_user (
  user_id      INT PRIMARY KEY REFERENCES app_user(user_id) ON DELETE CASCADE,
  access_level VARCHAR(20) DEFAULT 'Full'
);

-- ---------------------------------------------------------------------
-- CATEGORY  (EXTENSION - the doc has Category only as MENU_ITEM.Category text;
-- the UI's category filter chips are their own small lookup table)
-- ---------------------------------------------------------------------
CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  name        VARCHAR(60) UNIQUE NOT NULL,
  icon        VARCHAR(40)
);

-- ---------------------------------------------------------------------
-- MENU_ITEM
-- ---------------------------------------------------------------------
CREATE TABLE menu_item (
  item_id           SERIAL PRIMARY KEY,
  restaurant_id     INT NOT NULL REFERENCES restaurant(restaurant_id) ON DELETE CASCADE,
  name              VARCHAR(100) NOT NULL,
  category          VARCHAR(60),
  price             NUMERIC(8,2) NOT NULL CHECK (price > 0),
  original_price    NUMERIC(8,2),                          -- EXTENSION (strike-through price)
  description       VARCHAR(500),
  image_url         TEXT,                                   -- EXTENSION
  is_veg            BOOLEAN DEFAULT TRUE,                    -- EXTENSION
  rating            NUMERIC(2,1) DEFAULT 0,                  -- EXTENSION
  review_count      INT DEFAULT 0,                           -- EXTENSION
  calories          INT,                                     -- EXTENSION
  protein           VARCHAR(10),                             -- EXTENSION
  prep_time_minutes INT,                                     -- EXTENSION
  ingredients       TEXT[] DEFAULT '{}',                     -- EXTENSION
  is_available      BOOLEAN DEFAULT TRUE,
  is_popular        BOOLEAN DEFAULT FALSE,                   -- EXTENSION
  is_bestseller     BOOLEAN DEFAULT FALSE                    -- EXTENSION
);

-- EXTENSION: customisable variants/toppings shown in FoodDetailsModal
CREATE TABLE food_variant (
  variant_id   SERIAL PRIMARY KEY,
  item_id      INT NOT NULL REFERENCES menu_item(item_id) ON DELETE CASCADE,
  name         VARCHAR(60) NOT NULL,
  price_extra  NUMERIC(8,2) NOT NULL DEFAULT 0
);

CREATE TABLE food_topping (
  topping_id SERIAL PRIMARY KEY,
  item_id    INT NOT NULL REFERENCES menu_item(item_id) ON DELETE CASCADE,
  name       VARCHAR(60) NOT NULL,
  price      NUMERIC(8,2) NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------
-- CART / CART_ITEM  (weak entity, owner CART) - kept per the doc's design.
-- The current frontend keeps the in-progress cart in React state and only
-- talks to the backend at checkout, so these tables exist for schema
-- completeness / future use but aren't hit by the v1 API.
-- ---------------------------------------------------------------------
CREATE TABLE cart (
  cart_id     SERIAL PRIMARY KEY,
  customer_id INT NOT NULL UNIQUE REFERENCES customer(user_id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE cart_item (
  cart_id  INT NOT NULL REFERENCES cart(cart_id) ON DELETE CASCADE,
  item_id  INT NOT NULL REFERENCES menu_item(item_id),
  quantity INT NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (cart_id, item_id)
);

-- ---------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------
CREATE TABLE orders (
  order_id               SERIAL PRIMARY KEY,
  customer_id            INT NOT NULL REFERENCES customer(user_id),
  restaurant_id          INT NOT NULL REFERENCES restaurant(restaurant_id),
  order_date             TIMESTAMP NOT NULL DEFAULT now(),
  order_status           VARCHAR(20) NOT NULL DEFAULT 'Placed'
                         CHECK (order_status IN ('Placed','Preparing','Cooking','Packed','Out for Delivery','Delivered','Cancelled')),
  items_total            NUMERIC(8,2) NOT NULL,
  tax_amount             NUMERIC(8,2) NOT NULL DEFAULT 0,
  delivery_charge        NUMERIC(8,2) NOT NULL DEFAULT 0,
  discount_amount        NUMERIC(8,2) NOT NULL DEFAULT 0,     -- EXTENSION (coupon support)
  grand_total            NUMERIC(8,2) NOT NULL,
  delivery_address_line  VARCHAR(150) NOT NULL,               -- EXTENSION: snapshot of address at order time
  delivery_city          VARCHAR(50)  NOT NULL,
  delivery_zip           VARCHAR(10),
  estimated_delivery_time VARCHAR(40),                        -- EXTENSION, display text
  otp                    CHAR(4)                              -- EXTENSION: delivery handoff OTP
);

-- ORDER_ITEM (weak entity, owner ORDERS). Uses a surrogate key rather than
-- the doc's pure composite {OrderID, ItemID} so the same dish can appear
-- twice on one order with different variant/topping selections.
CREATE TABLE order_item (
  order_item_id         SERIAL PRIMARY KEY,
  order_id              INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  item_id               INT NOT NULL REFERENCES menu_item(item_id),
  quantity              INT NOT NULL CHECK (quantity > 0),
  unit_price            NUMERIC(8,2) NOT NULL,  -- snapshot, includes any variant/topping add-ons
  variant_name          VARCHAR(60),             -- EXTENSION: snapshot of chosen variant
  toppings_json         JSONB,                   -- EXTENSION: snapshot of chosen toppings
  special_instructions  VARCHAR(255)
);

-- ---------------------------------------------------------------------
-- PAYMENT (1:1 mandatory with ORDERS)
-- ---------------------------------------------------------------------
CREATE TABLE payment (
  payment_id       SERIAL PRIMARY KEY,
  order_id         INT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
  amount           NUMERIC(8,2) NOT NULL,
  payment_method   VARCHAR(20) NOT NULL CHECK (payment_method IN ('UPI','Card','Wallet','COD')),
  payment_status   VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending','Paid','Failed','Refunded')),
  transaction_date TIMESTAMP DEFAULT now()
);

-- ---------------------------------------------------------------------
-- DELIVERY (1:1 mandatory with ORDERS, M:1 with DELIVERY_PARTNER)
-- ---------------------------------------------------------------------
CREATE TABLE delivery (
  delivery_id     SERIAL PRIMARY KEY,
  order_id        INT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
  partner_id      INT REFERENCES delivery_partner(user_id),
  pickup_time     TIMESTAMP,
  delivered_time  TIMESTAMP,
  delivery_status VARCHAR(20) NOT NULL DEFAULT 'Assigned'
                  CHECK (delivery_status IN ('Assigned','Picked Up','Out for Delivery','Delivered'))
);

-- ---------------------------------------------------------------------
-- COUPON (EXTENSION - Offers page)
-- ---------------------------------------------------------------------
CREATE TABLE coupon (
  code             VARCHAR(20) PRIMARY KEY,
  description      VARCHAR(150),
  discount_percent INT NOT NULL,
  max_discount     NUMERIC(8,2) NOT NULL,
  min_order        NUMERIC(8,2) NOT NULL
);

-- ---------------------------------------------------------------------
-- REVIEW (EXTENSION - restaurant detail page reviews)
-- ---------------------------------------------------------------------
CREATE TABLE review (
  review_id      SERIAL PRIMARY KEY,
  restaurant_id  INT REFERENCES restaurant(restaurant_id) ON DELETE CASCADE,
  food_item_id   INT REFERENCES menu_item(item_id) ON DELETE SET NULL,
  user_name      VARCHAR(80) NOT NULL,
  user_avatar    TEXT,
  rating         INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        VARCHAR(500),
  likes          INT DEFAULT 0,
  created_at     TIMESTAMP DEFAULT now()
);

-- =====================================================================
-- TRIGGER: keep DeliveryStatus consistent with OrderStatus, per the
-- doc's business rule ("this transition is kept consistent with
-- DeliveryStatus through application logic / a database trigger").
-- =====================================================================
CREATE OR REPLACE FUNCTION sync_delivery_status() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_status = 'Out for Delivery' THEN
    UPDATE delivery
       SET delivery_status = 'Out for Delivery',
           pickup_time = COALESCE(pickup_time, now())
     WHERE order_id = NEW.order_id;
  ELSIF NEW.order_status = 'Delivered' THEN
    UPDATE delivery
       SET delivery_status = 'Delivered',
           delivered_time = now()
     WHERE order_id = NEW.order_id;
    UPDATE payment
       SET payment_status = 'Paid'
     WHERE order_id = NEW.order_id AND payment_status = 'Pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_delivery_status
AFTER UPDATE OF order_status ON orders
FOR EACH ROW
WHEN (OLD.order_status IS DISTINCT FROM NEW.order_status)
EXECUTE FUNCTION sync_delivery_status();

-- Helpful indexes
CREATE INDEX idx_menu_item_restaurant ON menu_item(restaurant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_order_item_order ON order_item(order_id);
