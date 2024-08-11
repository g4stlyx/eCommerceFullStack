package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.models.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist,Integer> {
    Optional<Wishlist> findByUser(User user);
}