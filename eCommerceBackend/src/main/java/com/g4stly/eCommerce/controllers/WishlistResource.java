package com.g4stly.eCommerce.controllers;

import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.g4stly.eCommerce.models.Wishlist;
import com.g4stly.eCommerce.models.WishlistItem;
import com.g4stly.eCommerce.repositories.WishlistItemRepository;
import com.g4stly.eCommerce.repositories.WishlistRepository;


@RestController
public class WishlistResource {

    private WishlistRepository wishlistRepository;
    private WishlistItemRepository wishlistItemRepository;

    public WishlistResource(WishlistRepository wishlistRepository, WishlistItemRepository wishlistItemRepository) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
    }

    //! check this again later, where is wishlistId coming from?
    @DeleteMapping("/wishlist/{product_id}")
    public void removeItemFromWishlist(Integer wishlistId, @PathVariable Integer wishlistItemId) {
        Optional<Wishlist> wishlistOpt = wishlistRepository.findById(wishlistId);
        if (wishlistOpt.isPresent()) {
            Wishlist wishlist = wishlistOpt.get();
            WishlistItem itemToRemove = null;
            for (WishlistItem item : wishlist.getWishlistItems()) {
                if (item.getId().equals(wishlistItemId)) {
                    itemToRemove = item;
                    break;
                }
            }
            if (itemToRemove != null) {
                wishlist.getWishlistItems().remove(itemToRemove);
                wishlistItemRepository.delete(itemToRemove);
                wishlistRepository.save(wishlist);
            }
        }
    }


}
