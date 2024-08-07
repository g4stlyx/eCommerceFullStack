package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Review;

public interface ReviewRepository extends JpaRepository<Review,Integer> {
    
}