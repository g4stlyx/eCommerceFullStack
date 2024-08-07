package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Product;

public interface ProductRepository extends JpaRepository<Product,Integer> {
    
}