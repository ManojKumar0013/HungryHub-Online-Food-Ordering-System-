-- =====================================================================
-- HungryHub seed data — mirrors src/data/mockData.ts so the app looks
-- the same as your team's demo, but now served from Postgres.
-- Run this AFTER schema.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------
INSERT INTO category (name, icon) VALUES
  ('All', 'Utensils'),
  ('Biryani (Most Popular)', 'Flame'),
  ('North Indian', 'Soup'),
  ('South Indian', 'Utensils'),
  ('Pizza & Pasta', 'Pizza'),
  ('Burgers & Fries', 'Ham'),
  ('Desserts & Drinks', 'IceCream');

-- ---------------------------------------------------------------------
-- RESTAURANTS
-- ---------------------------------------------------------------------
INSERT INTO restaurant
  (name, cuisine_types, rating, review_count, delivery_time_text, distance_text, price_for_two,
   image_url, banner_image_url, is_free_delivery, discount_badge, is_open, address, city, contact_number, tags)
VALUES
('Bawarchi Biryani House', ARRAY['Hyderabadi Biryani','Kebabs','Mughlai'], 4.9, 3420, '20-30 min', '1.2 km', 450,
 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
 TRUE, 'FLAT 20% OFF', TRUE, 'RTC X Roads & Hitech City Main Rd, Hyderabad', 'Hyderabad', '+91 98490 12345',
 ARRAY['Dum Biryani Specialty','Original Recipe','Top Rated #1']),

('Paradise Biryani', ARRAY['Authentic Biryani','Hyderabadi','Tandoori'], 4.8, 2980, '25-35 min', '2.4 km', 500,
 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
 TRUE, '₹100 OFF OVER ₹400', TRUE, 'Road No. 1, Banjara Hills & Koramangala, Bengaluru', 'Bengaluru', '+91 98850 67890',
 ARRAY['Iconic Since 1953','Royal Spice Blend','Famous Heritage']),

('Meghana Foods & Biryani', ARRAY['Andhra Style Biryani','Spicy Curries','Seafood'], 4.9, 4120, '20-30 min', '1.8 km', 400,
 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80',
 TRUE, 'FREE GULAB JAMUN ON ₹350', TRUE, 'Koramangala 5th Block, Bengaluru & Hitech City', 'Bengaluru', '+91 98110 54321',
 ARRAY['Boneless Biryani King','Fire Spicy','Bestseller']),

('Pista House Biryani & Haleem', ARRAY['Hyderabadi Biryani','Haleem','Bakery & Sweets'], 4.8, 2100, '30-40 min', '3.1 km', 450,
 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
 FALSE, '15% OFF ABOVE ₹500', TRUE, 'Banjara Hills, Hyderabad & Connaught Place, New Delhi', 'Hyderabad', '+91 97000 11223',
 ARRAY['GI Tagged Haleem','Saffron Rice','Pure Ghee']),

('Shah Ghouse Hotel & Biryani', ARRAY['Special Dum Biryani','Kebabs','Mughlai Delights'], 4.9, 3890, '20-30 min', '1.5 km', 420,
 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
 TRUE, 'FLAT 15% OFF', TRUE, 'Kondapur Cross Rd & Hitech City Area, Hyderabad', 'Hyderabad', '+91 98499 55443',
 ARRAY['Late Night Hub','Spicy Dum','Famous Kebab']),

('Behrouz Biryani - Royal Kitchen', ARRAY['Royal Persian Biryani','Mughlai','Kebabs'], 4.8, 2750, '25-35 min', '0.9 km', 550,
 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
 TRUE, '₹125 OFF ON ₹499', TRUE, 'Royal Cloud Kitchen, Hitech City & Koramangala', 'Hyderabad', '+91 91234 56789',
 ARRAY['Royal Royal Packaging','Kesar Infused','Nawabi Taste']);

-- ---------------------------------------------------------------------
-- MENU ITEMS
-- ---------------------------------------------------------------------
INSERT INTO menu_item
  (restaurant_id, name, category, price, original_price, description, image_url, is_veg, rating, review_count,
   calories, protein, prep_time_minutes, ingredients, is_available, is_popular, is_bestseller)
VALUES
((SELECT restaurant_id FROM restaurant WHERE name='Bawarchi Biryani House'),
 'Special Hyderabadi Mutton Dum Biryani', 'Biryani (Most Popular)', 380.00, 440.00,
 'Aromatic long-grain Basmati rice, marinated tender mutton slow-cooked in dhandi dum with saffron, mint, and secret whole spices. Served with Mirchi Ka Salan & Raita.',
 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
 FALSE, 4.9, 1840, 780, '42g', 20,
 ARRAY['Seeraga Basmati Rice','Fresh Tender Mutton','Kashmiri Saffron','Desi Ghee','Fried Onions'],
 TRUE, TRUE, TRUE),

((SELECT restaurant_id FROM restaurant WHERE name='Bawarchi Biryani House'),
 'Chef Special Chicken Dum Biryani', 'Biryani (Most Popular)', 310.00, 350.00,
 'Classic dum-cooked chicken biryani infused with fried shallots, cardamom, clove, fresh mint, and pure ghee drizzles.',
 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
 FALSE, 4.9, 1420, 720, '38g', 18,
 ARRAY['Basmati Rice','Chicken Drumsticks','Ghee','Whole Spices','Fried Onions'],
 TRUE, TRUE, TRUE),

((SELECT restaurant_id FROM restaurant WHERE name='Meghana Foods & Biryani'),
 'Meghana Boneless Chicken Biryani', 'Biryani (Most Popular)', 330.00, 380.00,
 'Signature fiery spicy Andhra boneless chicken masala layered over fragrant ghee rice and topped with roasted cashews.',
 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
 FALSE, 4.9, 2210, 810, '45g', 15,
 ARRAY['Boneless Chicken Breasts','Guntur Red Chilies','Cashews','Basmati Rice','Curry Leaves'],
 TRUE, FALSE, TRUE),

((SELECT restaurant_id FROM restaurant WHERE name='Paradise Biryani'),
 'Royal Subz-e-Paneer Dum Biryani', 'Biryani (Most Popular)', 260.00, 300.00,
 'Slow-cooked fresh cottage cheese cubes, cauliflower, green peas, and carrots folded into saffron-scented dum basmati rice.',
 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
 TRUE, 4.8, 940, 610, '22g', 15,
 ARRAY['Fresh Paneer','Basmati Rice','Saffron','Garden Vegetables','Cashews'],
 TRUE, TRUE, FALSE),

((SELECT restaurant_id FROM restaurant WHERE name='Pista House Biryani & Haleem'),
 'Signature Hyderabadi Haleem', 'North Indian', 290.00, 340.00,
 'Slow-cooked pounded wheat and meat haleem, rich in pure desi ghee, finished with fried shallots and fresh mint.',
 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
 FALSE, 4.9, 1890, 890, '40g', 15,
 ARRAY['Pure Desi Ghee','Broken Wheat','Tender Meat','Lemon & Mint','Fried Shallots'],
 TRUE, FALSE, TRUE),

((SELECT restaurant_id FROM restaurant WHERE name='Bawarchi Biryani House'),
 'Hot & Spicy Chicken Tandoori (Full)', 'North Indian', 420.00, 480.00,
 'Whole chicken marinated in hung curd, Kashmiri red chili powder, ginger-garlic paste, and roasted over hot charcoal clay oven.',
 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
 FALSE, 4.8, 1120, 780, '58g', 22,
 ARRAY['Fresh Whole Chicken','Hung Curd','Kashmiri Chilies','Mint Chutney','Charcoal Smoke'],
 TRUE, FALSE, FALSE),

((SELECT restaurant_id FROM restaurant WHERE name='Paradise Biryani'),
 'Shahi Butter Chicken & Garlic Naan Combo', 'North Indian', 320.00, 360.00,
 'Tender chicken tikka simmered in rich cream, cashew, and San Marzano tomato butter gravy. Served with 2 hot Garlic Butter Naans.',
 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
 FALSE, 4.9, 2450, 840, '36g', 18,
 ARRAY['Chicken Tikka','Cashew Cream','Butter','Kasoori Methi','Garlic Naan'],
 TRUE, FALSE, TRUE),

((SELECT restaurant_id FROM restaurant WHERE name='Pista House Biryani & Haleem'),
 'Shahi Double Ka Meetha & Gulab Jamun', 'Desserts & Drinks', 180.00, NULL,
 'Hyderabadi royal dessert prepared with fried bread soaked in saffron milk syrup, garnished with silver leaf, pistachios, and hot rabri.',
 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
 TRUE, 4.9, 880, 450, '8g', 10,
 ARRAY['Saffron Milk','Fried Bread','Pistachios & Almonds','Rabri','Edible Silver Foil'],
 TRUE, FALSE, FALSE);

-- Variants & toppings (only the two items that had them in mockData.ts)
INSERT INTO food_variant (item_id, name, price_extra) VALUES
((SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'), 'Single Pack', 0),
((SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'), 'Family Pack (Serves 3)', 220),
((SELECT item_id FROM menu_item WHERE name='Chef Special Chicken Dum Biryani'), 'Regular', 0),
((SELECT item_id FROM menu_item WHERE name='Chef Special Chicken Dum Biryani'), 'Jumbo Pack', 180);

INSERT INTO food_topping (item_id, name, price) VALUES
((SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'), 'Boiled Egg (2 pcs)', 30),
((SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'), 'Extra Mirchi Ka Salan', 40),
((SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'), 'Pomegranate Raita', 35),
((SELECT item_id FROM menu_item WHERE name='Chef Special Chicken Dum Biryani'), 'Add Chicken 65 (4 pcs)', 120);

-- ---------------------------------------------------------------------
-- COUPONS
-- ---------------------------------------------------------------------
INSERT INTO coupon (code, description, discount_percent, max_discount, min_order) VALUES
('BIRYANI50', 'Flat 50% OFF up to ₹200 on Biryani orders', 50, 200, 300),
('HUNGRY20', 'Get 20% OFF up to ₹150 on all food orders', 20, 150, 250),
('PARADISE100', 'Save ₹100 instantly on orders over ₹400', 15, 100, 400);

-- ---------------------------------------------------------------------
-- DEMO USERS  (all seeded with password: demo1234)
-- ---------------------------------------------------------------------
-- Customers
INSERT INTO app_user (name, email, phone, password_hash, role, avatar_url) VALUES
('Bondada Manoj Kumar', 'customer@hungryhub.in', '+91 98490 12345', crypt('demo1234', gen_salt('bf')), 'Customer',
 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
('Bandela Gowthamsai', 'gowtham@hungryhub.in', '+91 97777 65432', crypt('demo1234', gen_salt('bf')), 'Customer', NULL),
('Aarav Sharma', 'aarav@hungryhub.in', '+91 91234 56789', crypt('demo1234', gen_salt('bf')), 'Customer', NULL);

INSERT INTO customer (user_id, wallet_balance)
SELECT user_id, 850.00 FROM app_user WHERE email='customer@hungryhub.in';
INSERT INTO customer (user_id, wallet_balance)
SELECT user_id, 0 FROM app_user WHERE email='gowtham@hungryhub.in';
INSERT INTO customer (user_id, wallet_balance)
SELECT user_id, 0 FROM app_user WHERE email='aarav@hungryhub.in';

INSERT INTO customer_address (customer_id, title, address_line, city, zip_code, is_default)
SELECT user_id, 'Home', 'Flat 402, Cyber Towers Lane, Hitech City', 'Hyderabad', '500081', TRUE
FROM app_user WHERE email='customer@hungryhub.in';
INSERT INTO customer_address (customer_id, title, address_line, city, zip_code, is_default)
SELECT user_id, 'Office', 'Plot 12, Road No. 10, Banjara Hills', 'Hyderabad', '500034', FALSE
FROM app_user WHERE email='customer@hungryhub.in';

-- Staff (tied to Bawarchi Biryani House)
INSERT INTO app_user (name, email, phone, password_hash, role) VALUES
('Chef Mario (Head Chef)', 'staff@pizzeria.in', '+91 90000 00001', crypt('demo1234', gen_salt('bf')), 'Staff');
INSERT INTO staff (user_id, restaurant_id, designation)
SELECT u.user_id, (SELECT restaurant_id FROM restaurant WHERE name='Bawarchi Biryani House'), 'Head Chef'
FROM app_user u WHERE u.email='staff@pizzeria.in';

-- Delivery Partners
INSERT INTO app_user (name, email, phone, password_hash, role, avatar_url) VALUES
('Alex Rivera (Express Agent)', 'driver@hungryhub.in', '+91 98888 43210', crypt('demo1234', gen_salt('bf')), 'DeliveryPartner',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'),
('Pagidela Obulesu', 'obulesu@hungryhub.in', '+91 94444 11223', crypt('demo1234', gen_salt('bf')), 'DeliveryPartner',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80');

INSERT INTO delivery_partner (user_id, vehicle_type, vehicle_number, availability_status)
SELECT user_id, 'EV Scooter', 'TS09EA1234', 'Available' FROM app_user WHERE email='driver@hungryhub.in';
INSERT INTO delivery_partner (user_id, vehicle_type, vehicle_number, availability_status)
SELECT user_id, 'Delivery Bike', 'TS09EB5678', 'Available' FROM app_user WHERE email='obulesu@hungryhub.in';

-- Admin
INSERT INTO app_user (name, email, phone, password_hash, role) VALUES
('System Administrator (Root)', 'admin@hungryhub.in', '+91 90000 00099', crypt('demo1234', gen_salt('bf')), 'Admin');
INSERT INTO admin_user (user_id, access_level)
SELECT user_id, 'Full' FROM app_user WHERE email='admin@hungryhub.in';

-- ---------------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------------
INSERT INTO review (restaurant_id, food_item_id, user_name, user_avatar, rating, comment, likes) VALUES
((SELECT restaurant_id FROM restaurant WHERE name='Bawarchi Biryani House'),
 (SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'),
 'Bondada Manoj Kumar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
 5, 'The Special Hyderabadi Mutton Dum Biryani was absolute perfection! Generous tender meat pieces, authentic saffron aroma, and delivered piping hot in 20 minutes!', 24),
((SELECT restaurant_id FROM restaurant WHERE name='Meghana Foods & Biryani'),
 (SELECT item_id FROM menu_item WHERE name='Meghana Boneless Chicken Biryani'),
 'Kommineni Yashwanth', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
 5, 'Meghana Boneless Chicken Biryani is hands down the best biryani in town! Unbeatable spice kick and fresh ghee flavor.', 18);

-- ---------------------------------------------------------------------
-- SAMPLE ORDERS (one per lifecycle stage, so every dashboard has data to show)
-- ---------------------------------------------------------------------
-- Order 1: Out for Delivery
WITH cust AS (SELECT user_id FROM app_user WHERE email='customer@hungryhub.in'),
     rest AS (SELECT restaurant_id FROM restaurant WHERE name='Bawarchi Biryani House'),
     addr AS (SELECT address_line, city, zip_code FROM customer_address WHERE customer_id=(SELECT user_id FROM cust) AND is_default),
     drv  AS (SELECT user_id FROM app_user WHERE email='driver@hungryhub.in'),
     ins_order AS (
       INSERT INTO orders (customer_id, restaurant_id, order_status, items_total, tax_amount, delivery_charge,
                            discount_amount, grand_total, delivery_address_line, delivery_city, delivery_zip,
                            estimated_delivery_time, otp)
       SELECT (SELECT user_id FROM cust), (SELECT restaurant_id FROM rest), 'Out for Delivery',
              780.00, 39.00, 0, 150.00, 669.00,
              (SELECT address_line FROM addr), (SELECT city FROM addr), (SELECT zip_code FROM addr),
              '12 mins away', '4829'
       RETURNING order_id
     )
INSERT INTO order_item (order_id, item_id, quantity, unit_price, variant_name)
SELECT (SELECT order_id FROM ins_order), (SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'), 1, 600.00, 'Family Pack (Serves 3)'
UNION ALL
SELECT (SELECT order_id FROM ins_order), (SELECT item_id FROM menu_item WHERE name='Shahi Double Ka Meetha & Gulab Jamun'), 1, 180.00, NULL;

INSERT INTO payment (order_id, amount, payment_method, payment_status)
SELECT MAX(order_id), 669.00, 'UPI', 'Paid' FROM orders;

INSERT INTO delivery (order_id, partner_id, delivery_status, pickup_time)
SELECT (SELECT MAX(order_id) FROM orders), (SELECT user_id FROM app_user WHERE email='driver@hungryhub.in'), 'Out for Delivery', now();

-- Order 2: Preparing
WITH cust AS (SELECT user_id FROM app_user WHERE email='gowtham@hungryhub.in'),
     rest AS (SELECT restaurant_id FROM restaurant WHERE name='Meghana Foods & Biryani'),
     ins_order AS (
       INSERT INTO orders (customer_id, restaurant_id, order_status, items_total, tax_amount, delivery_charge,
                            discount_amount, grand_total, delivery_address_line, delivery_city, delivery_zip,
                            estimated_delivery_time, otp)
       SELECT (SELECT user_id FROM cust), (SELECT restaurant_id FROM rest), 'Preparing',
              660.00, 33.00, 30.00, 100.00, 623.00,
              'Plot 12, Road No. 10, Banjara Hills', 'Hyderabad', '500034',
              '20 mins away', '1904'
       RETURNING order_id
     )
INSERT INTO order_item (order_id, item_id, quantity, unit_price)
SELECT (SELECT order_id FROM ins_order), (SELECT item_id FROM menu_item WHERE name='Meghana Boneless Chicken Biryani'), 2, 330.00;

INSERT INTO payment (order_id, amount, payment_method, payment_status)
SELECT MAX(order_id), 623.00, 'Card', 'Paid' FROM orders;

INSERT INTO delivery (order_id, partner_id, delivery_status)
SELECT (SELECT MAX(order_id) FROM orders), (SELECT user_id FROM app_user WHERE email='obulesu@hungryhub.in'), 'Assigned';

-- Order 3: Delivered
WITH cust AS (SELECT user_id FROM app_user WHERE email='aarav@hungryhub.in'),
     rest AS (SELECT restaurant_id FROM restaurant WHERE name='Paradise Biryani'),
     ins_order AS (
       INSERT INTO orders (customer_id, restaurant_id, order_status, items_total, tax_amount, delivery_charge,
                            discount_amount, grand_total, delivery_address_line, delivery_city, delivery_zip,
                            estimated_delivery_time)
       SELECT (SELECT user_id FROM cust), (SELECT restaurant_id FROM rest), 'Delivered',
              380.00, 19.00, 0, 50.00, 349.00,
              'Flat 402, Cyber Towers Lane, Hitech City', 'Hyderabad', '500081',
              'Delivered at 8:15 PM'
       RETURNING order_id
     )
INSERT INTO order_item (order_id, item_id, quantity, unit_price)
SELECT (SELECT order_id FROM ins_order), (SELECT item_id FROM menu_item WHERE name='Special Hyderabadi Mutton Dum Biryani'), 1, 380.00;

INSERT INTO payment (order_id, amount, payment_method, payment_status)
SELECT MAX(order_id), 349.00, 'UPI', 'Paid' FROM orders;

INSERT INTO delivery (order_id, partner_id, delivery_status, pickup_time, delivered_time)
SELECT (SELECT MAX(order_id) FROM orders), (SELECT user_id FROM app_user WHERE email='driver@hungryhub.in'), 'Delivered', now() - interval '2 hours', now() - interval '1 hour 40 minutes';
