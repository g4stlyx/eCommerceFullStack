package com.g4stly.eCommerce.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.Review;
import com.g4stly.eCommerce.models.User;

public interface ReviewRepository extends JpaRepository<Review,Integer> {
    List<Review> findByProductId(Integer productId);
    Optional<Review> findByProductAndUser(Product product, User user);
}