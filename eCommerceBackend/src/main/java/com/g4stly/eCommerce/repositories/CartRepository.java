package com.g4stly.eCommerce.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.Cart;
import com.g4stly.eCommerce.models.User;

public interface CartRepository extends JpaRepository<Cart,Integer> {
    Optional<Cart> findByUser(User user);
}