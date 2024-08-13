package com.g4stly.eCommerce.controllers;

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

import com.g4stly.eCommerce.models.Cart;
import com.g4stly.eCommerce.models.CartItem;
import com.g4stly.eCommerce.models.Order;
import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.CartItemRepository;
import com.g4stly.eCommerce.repositories.CartRepository;
import com.g4stly.eCommerce.repositories.OrderRepository;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.UserRepository;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartResourceTest {
    
    @InjectMocks
    private CartResource cartResource;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @Test
    void testGetCart_Success() {
        User user = new User();
        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = cartResource.getCart();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(cart, response.getBody());
        verify(userRepository, times(1)).findByUsername("username");
    }

    @Test
    void testGetCart_Empty() {
        User user = new User();
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = cartResource.getCart();

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Your cart is empty :(", response.getBody());
    }

    @Test
    void testGetCartById_Success() {
        User user = new User();
        Cart cart = new Cart();
        cart.setUser(user);
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));
        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));

        ResponseEntity<?> response = cartResource.getCartById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(cart, response.getBody());
    }

    @Test
    void testGetCartById_Unauthorized() {
        User user = new User();
        Cart cart = new Cart();
        cart.setUser(new User()); // different user
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));
        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));

        ResponseEntity<?> response = cartResource.getCartById(1);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("You are not authorized to view this resource: getting cart by id 1", response.getBody());
    }

    @Test
    void testAddItemToCart_Success() {
        User user = new User();
        Product product = new Product();
        Cart cart = new Cart();
        CartItem cartItem = new CartItem();
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);

        ResponseEntity<?> response = cartResource.addItemToCart(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(((Cart) response.getBody()).getCartItems().contains(cartItem));
        verify(cartRepository, times(1)).save(cart);
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void testRemoveItemFromCart_Success() {
        User user = new User();
        Cart cart = new Cart();
        CartItem cartItem = new CartItem();
        cartItem.setId(1);
        cart.getCartItems().add(cartItem);
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        cartResource.removeItemFromCart(1);

        assertFalse(cart.getCartItems().contains(cartItem));
        verify(cartItemRepository, times(1)).delete(cartItem);
        verify(cartRepository, times(1)).save(cart);
    }

    @Test
    void testUpdateCartItemQuantity_Success() {
        User user = new User();
        CartItem cartItem = new CartItem();
        cartItem.setId(1);
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));
        when(cartItemRepository.findById(1)).thenReturn(Optional.of(cartItem));

        ResponseEntity<?> response = cartResource.updateCartItemQuantity(1, 5);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(5, ((CartItem) response.getBody()).getQuantity());
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void testCreateOrderFromCart_Success() {
        User user = new User();
        Cart cart = new Cart();
        Product product = new Product();
        product.setPrice(100);
        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(2);
        cart.getCartItems().add(cartItem);
        when(authentication.getName()).thenReturn("username");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));
        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = cartResource.createOrderFromCart(1);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Order order = (Order) response.getBody();
        assertNotNull(order);
        assertEquals(200, order.getTotalPrice());
        verify(cartItemRepository, times(1)).delete(cartItem);
        verify(cartRepository, times(1)).save(cart);
    }
}
