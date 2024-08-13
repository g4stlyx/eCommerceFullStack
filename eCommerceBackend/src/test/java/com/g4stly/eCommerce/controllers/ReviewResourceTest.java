package com.g4stly.eCommerce.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.Review;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.ReviewRepository;
import com.g4stly.eCommerce.repositories.UserRepository;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

class ReviewResourceTest {
    
    @InjectMocks
    private ReviewResource reviewResource;
    @Mock
    private ReviewRepository reviewRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Set up the security context for mocking authenticated users
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testGetReviewsByProductId() {
        Integer productId = 1;
        List<Review> mockReviews = new ArrayList<>();
        when(reviewRepository.findByProductId(productId)).thenReturn(mockReviews);

        ResponseEntity<?> response = reviewResource.getReviewsByProductId(productId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockReviews, response.getBody());
    }

    @Test
    void testGetReviewById_ValidReview() {
        Integer productId = 1;
        Integer reviewId = 1;
        Review mockReview = new Review();
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockReview.setProduct(mockProduct);

        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(mockReview));

        ResponseEntity<?> response = reviewResource.getReviewById(productId, reviewId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockReview, response.getBody());
    }

    @Test
    void testGetReviewById_ReviewNotBelongToProduct() {
        Integer productId = 1;
        Integer reviewId = 1;
        Review mockReview = new Review();
        Product mockProduct = new Product();
        mockProduct.setId(2);
        mockReview.setProduct(mockProduct);

        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(mockReview));

        ResponseEntity<?> response = reviewResource.getReviewById(productId, reviewId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Review does not belong to the specified product", response.getBody());
    }

    @Test
    void testAddReview_ValidReview() {
        Integer productId = 1;
        Review review = new Review();
        Product mockProduct = new Product();
        User mockUser = new User();
        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));
        when(authentication.getName()).thenReturn("testUser");
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(mockUser));
        when(reviewRepository.save(review)).thenReturn(review);

        ResponseEntity<?> response = reviewResource.addReview(productId, review);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(reviewRepository, times(1)).save(review);
        assertEquals(mockUser, review.getUser());
        assertEquals(mockProduct, review.getProduct());
    }

    @Test
    void testUpdateReview_Unauthorized() {
        Integer productId = 1;
        Integer reviewId = 1;
        Review existingReview = new Review();
        User mockUser = new User();
        mockUser.setUsername("anotherUser");

        when(authentication.getName()).thenReturn("testUser");
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(mockUser));
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(existingReview));

        ResponseEntity<?> response = reviewResource.updateReview(productId, reviewId, new Review());

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Unauthorized to update this review", response.getBody());
    }

    @Test
    void testDeleteReview_Unauthorized() {
        Integer productId = 1;
        Integer reviewId = 1;
        Review mockReview = new Review();
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockReview.setProduct(mockProduct);

        User mockUser = new User();
        mockUser.setUsername("anotherUser");

        when(authentication.getName()).thenReturn("testUser");
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(mockUser));
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(mockReview));

        ResponseEntity<?> response = reviewResource.deleteReview(productId, reviewId);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Unauthorized to delete this review", response.getBody());
    }

}
