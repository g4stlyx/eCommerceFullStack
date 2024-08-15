package com.g4stly.eCommerce.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.Review;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.ReviewRepository;
import com.g4stly.eCommerce.repositories.UserRepository;

@RestController
public class ReviewResource {

    private ProductRepository productRepository;
    private ReviewRepository reviewRepository;
    private UserRepository userRepository;

    public ReviewResource(ReviewRepository reviewRepository, ProductRepository productRepository,
            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/products/{product_id}/reviews")
    public ResponseEntity<?> getReviewsByProductId(@PathVariable Integer product_id) {
        try {
            List<Review> reviews = reviewRepository.findByProductId(product_id);
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/products/{product_id}/reviews/{review_id}")
    public ResponseEntity<?> getReviewById(@PathVariable Integer product_id, @PathVariable Integer review_id) {
        try {
            Review review = reviewRepository.findById(review_id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));

            if (!review.getProduct().getId().equals(product_id)) {
                return new ResponseEntity<>("Review does not belong to the specified product", HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(review, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/products/{product_id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Integer product_id, @RequestBody Review review) {
        try {
            Product product = productRepository.findById(product_id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            review.setUser(user);
            review.setProduct(product);
            review.setCreatedAt(LocalDateTime.now());
            review.setUpdatedAt(LocalDateTime.now());
            Review savedReview = reviewRepository.save(review);
            return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/products/{product_id}/reviews/{review_id}")
    public ResponseEntity<?> updateReview(@PathVariable Integer product_id, @PathVariable Integer review_id,
            @RequestBody Review reviewDetails) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Review review = reviewRepository.findById(review_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!currentUser.isAdmin() && !review.getUser().getUsername().equals(currentUsername)) {
            return new ResponseEntity<>("Unauthorized to update this review", HttpStatus.UNAUTHORIZED);
        }

        review.setTitle(reviewDetails.getTitle());
        review.setText(reviewDetails.getText());
        review.setRating(reviewDetails.getRating());
        review.setUpdatedAt(LocalDateTime.now());

        Review updatedReview = reviewRepository.save(review);
        return new ResponseEntity<>(updatedReview, HttpStatus.OK);
    }

    @DeleteMapping("/products/{product_id}/reviews/{review_id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer product_id, @PathVariable Integer review_id) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Review review = reviewRepository.findById(review_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getProduct().getId().equals(product_id)) {
            return new ResponseEntity<>("Review does not belong to the specified product", HttpStatus.BAD_REQUEST);
        }

        if (!currentUser.isAdmin() && !review.getUser().getUsername().equals(currentUsername)) {
            return new ResponseEntity<>("Unauthorized to delete this review", HttpStatus.UNAUTHORIZED);
        }

        reviewRepository.deleteById(review_id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
