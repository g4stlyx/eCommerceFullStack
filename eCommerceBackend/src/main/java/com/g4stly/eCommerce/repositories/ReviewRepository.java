package com.g4stly.eCommerce.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Review;

public interface ReviewRepository extends JpaRepository<Review,Integer> {
    List<Review> findByProductId(Integer productId);
}