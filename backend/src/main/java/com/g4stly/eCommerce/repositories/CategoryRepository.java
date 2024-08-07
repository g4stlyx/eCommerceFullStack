package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Category;

public interface CategoryRepository extends JpaRepository<Category,Integer> {
    
}