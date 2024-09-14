package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Order;
import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.User;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    boolean existsByUserAndOrderItemsProduct(User user, Product product);
}