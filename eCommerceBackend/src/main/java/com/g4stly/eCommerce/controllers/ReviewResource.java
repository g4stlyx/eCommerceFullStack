package com.g4stly.eCommerce.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.g4stly.eCommerce.repositories.OrderRepository;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.ReviewRepository;
import com.g4stly.eCommerce.repositories.UserRepository;

@RestController
@CrossOrigin("http://localhost:5173")
public class ReviewResource {

    private ProductRepository productRepository;
    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private OrderRepository orderRepository;

    public ReviewResource(ReviewRepository reviewRepository, ProductRepository productRepository,
            UserRepository userRepository, OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!user.isAdmin()) {
                return new ResponseEntity<>("You are not authorized to view this resource: getting all orders",
                        HttpStatus.UNAUTHORIZED);
            }

            return new ResponseEntity<>(reviewRepository.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

            // Check if the user has already reviewed this product
            Optional<Review> existingReview = reviewRepository.findByProductAndUser(product, user);
            if (existingReview.isPresent()) {
                // Return 400 Bad Request if the user already reviewed this product
                return new ResponseEntity<>("Bu ürünü zaten değerlendirdiniz.", HttpStatus.BAD_REQUEST);
            }

            // Check if the user has purchased this product
            boolean hasPurchased = orderRepository.existsByUserAndOrderItemsProduct(user, product);
            if (!hasPurchased) {
                // Return 400 Bad Request if the user hasn't bought the product
                return new ResponseEntity<>("Ürünü değerlendirmek için daha önce satın almış olmanız gerekmektedir.",
                        HttpStatus.BAD_REQUEST);
            }

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
