package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}