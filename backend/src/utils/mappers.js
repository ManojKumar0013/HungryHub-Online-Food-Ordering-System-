// Every function here turns Postgres row(s) into the exact object shape
// that src/types.ts on the frontend expects, so the React components
// don't need to change how they read their data.

export function mapRestaurant(r) {
  return {
    id: String(r.restaurant_id),
    name: r.name,
    cuisine: r.cuisine_types || [],
    rating: Number(r.rating),
    reviewCount: r.review_count,
    deliveryTime: r.delivery_time_text,
    distance: r.distance_text,
    priceForTwo: Number(r.price_for_two),
    image: r.image_url,
    bannerImage: r.banner_image_url,
    isFreeDelivery: r.is_free_delivery,
    discountBadge: r.discount_badge || undefined,
    isOpen: r.is_open,
    address: r.address,
    phone: r.contact_number,
    tags: r.tags || [],
  };
}

export function mapFoodItem(f, variants = [], toppings = []) {
  return {
    id: String(f.item_id),
    restaurantId: String(f.restaurant_id),
    restaurantName: f.restaurant_name,
    name: f.name,
    description: f.description,
    price: Number(f.price),
    originalPrice: f.original_price != null ? Number(f.original_price) : undefined,
    image: f.image_url,
    category: f.category,
    isVeg: f.is_veg,
    rating: Number(f.rating),
    reviewCount: f.review_count,
    calories: f.calories ?? undefined,
    protein: f.protein ?? undefined,
    prepTimeMinutes: f.prep_time_minutes,
    ingredients: f.ingredients || [],
    variants: variants.length
      ? variants.map((v) => ({ id: String(v.variant_id), name: v.name, priceExtra: Number(v.price_extra) }))
      : undefined,
    toppings: toppings.length
      ? toppings.map((t) => ({ id: String(t.topping_id), name: t.name, price: Number(t.price) }))
      : undefined,
    isAvailable: f.is_available,
    isPopular: f.is_popular,
    isBestseller: f.is_bestseller,
  };
}

export function mapAddress(a) {
  return {
    id: String(a.address_id),
    title: a.title,
    addressLine: a.address_line,
    city: a.city,
    zipCode: a.zip_code,
    isDefault: a.is_default,
  };
}

export function mapCoupon(c) {
  return {
    code: c.code,
    description: c.description,
    discountPercent: c.discount_percent,
    maxDiscount: Number(c.max_discount),
    minOrder: Number(c.min_order),
  };
}

export function mapReview(r) {
  return {
    id: String(r.review_id),
    userName: r.user_name,
    userAvatar: r.user_avatar,
    rating: r.rating,
    date: r.created_at,
    comment: r.comment,
    foodItemName: r.food_item_name || undefined,
    likes: r.likes,
  };
}

// order row + its joined order_item rows (each order_item row already
// carries the full menu_item snapshot columns via the query's JOIN)
export function mapOrder(orderRow, itemRows) {
  return {
    id: `ORD-${orderRow.order_id}`,
    customerId: String(orderRow.customer_id),
    customerName: orderRow.customer_name,
    customerPhone: orderRow.customer_phone,
    restaurantId: String(orderRow.restaurant_id),
    restaurantName: orderRow.restaurant_name,
    items: itemRows.map((it) => ({
      id: `oi-${it.order_item_id}`,
      food: mapFoodItem(it),
      quantity: it.quantity,
      selectedVariant: it.variant_name ? { id: `v-${it.order_item_id}`, name: it.variant_name, priceExtra: 0 } : undefined,
      selectedToppings: it.toppings_json || undefined,
      specialInstructions: it.special_instructions || undefined,
      itemTotal: Number(it.unit_price) * it.quantity,
    })),
    subtotal: Number(orderRow.items_total),
    tax: Number(orderRow.tax_amount),
    deliveryFee: Number(orderRow.delivery_charge),
    discount: Number(orderRow.discount_amount),
    total: Number(orderRow.grand_total),
    status: orderRow.order_status,
    paymentMethod: orderRow.payment_method,
    paymentStatus: orderRow.payment_status,
    deliveryAddress: {
      id: `addr-order-${orderRow.order_id}`,
      title: 'Delivery Address',
      addressLine: orderRow.delivery_address_line,
      city: orderRow.delivery_city,
      zipCode: orderRow.delivery_zip,
    },
    driverId: orderRow.driver_id ? String(orderRow.driver_id) : undefined,
    driverName: orderRow.driver_name || undefined,
    driverPhone: orderRow.driver_phone || undefined,
    driverAvatar: orderRow.driver_avatar || undefined,
    estimatedDeliveryTime: orderRow.estimated_delivery_time,
    otp: orderRow.otp || undefined,
    createdAt: orderRow.order_date,
  };
}

export function mapUserProfile(u, addresses = []) {
  return {
    id: String(u.user_id),
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: { Customer: 'customer', Staff: 'staff', DeliveryPartner: 'driver', Admin: 'admin' }[u.role],
    avatar: u.avatar_url,
    walletBalance: u.wallet_balance != null ? Number(u.wallet_balance) : 0,
    addresses: addresses.map(mapAddress),
  };
}
