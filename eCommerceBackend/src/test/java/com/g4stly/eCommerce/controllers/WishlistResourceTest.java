package com.g4stly.eCommerce.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.models.Wishlist;
import com.g4stly.eCommerce.models.WishlistItem;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.UserRepository;
import com.g4stly.eCommerce.repositories.WishlistItemRepository;
import com.g4stly.eCommerce.repositories.WishlistRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


public class WishlistResourceTest {

    @InjectMocks
    private WishlistResource wishlistResource;

    @Mock
    private WishlistRepository wishlistRepository;
    @Mock
    private WishlistItemRepository wishlistItemRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private Authentication authentication;
    @Mock
    private SecurityContext securityContext;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(wishlistResource).build();
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void testGetWishlist_Success() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        User user = new User();
        Wishlist wishlist = new Wishlist();
        user.setWishlist(wishlist);
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = wishlistResource.getWishlist();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(wishlist, response.getBody());
    }

    @Test
    public void testGetWishlist_UserNotFound() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        when(userRepository.findByUsername("testUser")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            wishlistResource.getWishlist();
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    public void testAddItemToWishlist_Success() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        User user = new User();
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        Product product = new Product();
        product.setId(1);
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        Wishlist wishlist = new Wishlist();
        wishlist.setWishlistItems(new ArrayList<WishlistItem>());
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        ResponseEntity<?> response = wishlistResource.addItemToWishlist(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(wishlist, response.getBody());
        verify(wishlistRepository, times(1)).save(wishlist);
        verify(wishlistItemRepository, times(1)).save(any(WishlistItem.class));
    }

    @Test
    public void testAddItemToWishlist_ItemAlreadyExists() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        User user = new User();
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        Product product = new Product();
        product.setId(1);
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        Wishlist wishlist = new Wishlist();
        WishlistItem existingItem = new WishlistItem();
        wishlist.setWishlistItems(new ArrayList<WishlistItem>());
        existingItem.setProduct(product);
        wishlist.getWishlistItems().add(existingItem);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        ResponseEntity<?> response = wishlistResource.addItemToWishlist(1);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("The item already exists in your wishlist", response.getBody());
        verify(wishlistRepository, never()).save(any(Wishlist.class));
        verify(wishlistItemRepository, never()).save(any(WishlistItem.class));
    }

    @Test
    public void testAddItemToWishlist_UserNotFound() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        when(userRepository.findByUsername("testUser")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            wishlistResource.addItemToWishlist(1);
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    public void testAddItemToWishlist_ProductNotFound() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        User user = new User();
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        when(productRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            wishlistResource.addItemToWishlist(1);
        });

        assertEquals("Product not found", exception.getMessage());
    }

    @Test
    public void testRemoveItemFromWishlist_Success() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        User user = new User();
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        Wishlist wishlist = new Wishlist();
        WishlistItem item = new WishlistItem();
        wishlist.setWishlistItems(new ArrayList<WishlistItem>());
        item.setId(1);
        wishlist.getWishlistItems().add(item);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        wishlistResource.removeItemFromWishlist(1);

        verify(wishlistItemRepository, times(1)).delete(item);
        verify(wishlistRepository, times(1)).save(wishlist);
    }

    @Test
    public void testRemoveItemFromWishlist_ItemNotFound() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        User user = new User();
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        Wishlist wishlist = new Wishlist();
        List<WishlistItem> wishlistItems = new ArrayList<>();
        wishlist.setWishlistItems(wishlistItems);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            wishlistResource.removeItemFromWishlist(1);
        });

        assertEquals("Item with id 1 couldn't be found in your wishlist", exception.getMessage());
        verify(wishlistItemRepository, never()).delete(any(WishlistItem.class));
        verify(wishlistRepository, never()).save(any(Wishlist.class));
    }

    @Test
    public void testRemoveItemFromWishlist_UserNotFound() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");

        when(userRepository.findByUsername("testUser")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            wishlistResource.removeItemFromWishlist(1);
        });

        assertEquals("User not found", exception.getMessage());
    }
}
