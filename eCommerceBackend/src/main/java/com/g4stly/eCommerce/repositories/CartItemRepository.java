package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
}