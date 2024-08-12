package com.g4stly.eCommerce.controllers;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.models.Wishlist;
import com.g4stly.eCommerce.models.WishlistItem;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.UserRepository;
import com.g4stly.eCommerce.repositories.WishlistItemRepository;
import com.g4stly.eCommerce.repositories.WishlistRepository;


@RestController
public class WishlistResource {

    private WishlistRepository wishlistRepository;
    private UserRepository userRepository;
    private ProductRepository productRepository;
    private WishlistItemRepository wishlistItemRepository;

    public WishlistResource(WishlistRepository wishlistRepository, WishlistItemRepository wishlistItemRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/wishlist")
    public ResponseEntity<?> getWishlist(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new ResponseEntity<>(user.getWishlist(), HttpStatus.OK);
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<?> addItemToWishlist(@PathVariable Integer productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Optional<Wishlist> wishlistOpt = wishlistRepository.findByUser(user);
        Wishlist wishlist = null;
        if (wishlistOpt.isPresent()) {
            wishlist = wishlistOpt.get();
        } else {
            wishlist = new Wishlist();
            List<WishlistItem> wishlistItems = new ArrayList<WishlistItem>();
            wishlist.setUser(user);
            wishlist.setWishlistItems(wishlistItems);
            wishlistRepository.save(wishlist);
        }
        WishlistItem item = new WishlistItem();
        //if item already exists in the list, dont add.
        for(WishlistItem wishlistItem : wishlist.getWishlistItems()){
            Product productToCheck = wishlistItem.getProduct();
            if(productToCheck.getId().equals(productId)){
                return new ResponseEntity<>("The item already exists in your wishlist", HttpStatus.BAD_REQUEST);
            }
        }
        item.setProduct(product);
        item.setWishlist(wishlist);
        wishlistItemRepository.save(item);
        wishlist.getWishlistItems().add(item);
        wishlistRepository.save(wishlist);
        return new ResponseEntity<>(wishlist, HttpStatus.OK);
    }

    @DeleteMapping("/wishlist/{wishlistItemId}")
    public void removeItemFromWishlist(@PathVariable Integer wishlistItemId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Wishlist> wishlistOpt = wishlistRepository.findByUser(user);
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
            if(itemToRemove == null){
                throw new RuntimeException("Item with id "+ wishlistItemId +" couldn't be found in your wishlist");
            }
        }
    }


}
