package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Cart;

public interface CartRepository extends JpaRepository<Cart,Integer> {
    
}