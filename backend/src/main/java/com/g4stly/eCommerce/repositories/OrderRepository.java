package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Order;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    
}