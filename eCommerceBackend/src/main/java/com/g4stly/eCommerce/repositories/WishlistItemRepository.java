package com.g4stly.eCommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.g4stly.eCommerce.models.WishlistItem;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Integer> {
}