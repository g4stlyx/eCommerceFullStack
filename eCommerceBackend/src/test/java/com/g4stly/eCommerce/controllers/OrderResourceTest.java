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

import com.g4stly.eCommerce.models.Order;
import com.g4stly.eCommerce.models.OrderItem;
import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.OrderRepository;
import com.g4stly.eCommerce.repositories.UserRepository;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderResourceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;
    @InjectMocks
    private OrderResource orderResource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @Test
    void testGetAllOrders_AsAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(true);
        when(authentication.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));
        when(orderRepository.findAll()).thenReturn(Arrays.asList(new Order(), new Order()));

        ResponseEntity<?> response = orderResource.getAllOrders();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void testGetAllOrders_AsNonAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(false);
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        ResponseEntity<?> response = orderResource.getAllOrders();

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("You are not authorized to view this resource: getting all orders", response.getBody());
        verify(orderRepository, never()).findAll();
    }

    @Test
    void testGetOrderById_AsAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(true);
        when(authentication.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));

        Order mockOrder = new Order();
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        ResponseEntity<?> response = orderResource.getOrderById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockOrder, response.getBody());
        verify(orderRepository, times(1)).findById(1);
    }

    @Test
    void testGetOrderById_AsNonAdmin_AndOwner() {
        User mockUser = new User();
        mockUser.setAdmin(false);
        mockUser.setUsername("user");
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        Order mockOrder = new Order();
        mockOrder.setUser(mockUser);
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        ResponseEntity<?> response = orderResource.getOrderById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockOrder, response.getBody());
        verify(orderRepository, times(1)).findById(1);
    }

    @Test
    void testGetOrderById_AsNonAdmin_NotOwner() {
        User mockUser = new User();
        mockUser.setAdmin(false);
        mockUser.setUsername("user");
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        User anotherUser = new User();
        anotherUser.setUsername("anotherUser");

        Order mockOrder = new Order();
        mockOrder.setUser(anotherUser);
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        ResponseEntity<?> response = orderResource.getOrderById(1);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("You are not authorized to view this resource: getting order by id 1", response.getBody());
        verify(orderRepository, times(1)).findById(1);
    }

    @Test
    void testCreateOrder_Success() {
        User mockUser = new User();
        mockUser.setUsername("user");
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        Product mockProduct = new Product();
        mockProduct.setPrice(100.0);

        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(mockProduct);
        orderItem.setQuantity(2);

        Order order = new Order();
        order.setOrderItems(Arrays.asList(orderItem));

        when(orderRepository.save(order)).thenReturn(order);

        ResponseEntity<?> response = orderResource.createOrder(order);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(orderRepository, times(1)).save(order);
        assertEquals(mockUser, order.getUser());
        assertEquals(200.0, order.getTotalPrice());
        assertEquals("CREATED", order.getStatus());
    }

    @Test
    void testCancelOrder_AsAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(true);
        when(authentication.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));

        Order mockOrder = new Order();
        mockOrder.setStatus("CREATED");
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        ResponseEntity<?> response = orderResource.cancelOrder(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("CANCELED", mockOrder.getStatus());
        verify(orderRepository, times(1)).save(mockOrder);
    }

    @Test
    void testCancelOrder_AsNonAdmin_AndOwner() {
        User mockUser = new User();
        mockUser.setAdmin(false);
        mockUser.setUsername("user");
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        Order mockOrder = new Order();
        mockOrder.setUser(mockUser);
        mockOrder.setStatus("CREATED");
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        ResponseEntity<?> response = orderResource.cancelOrder(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("CANCELED", mockOrder.getStatus());
        verify(orderRepository, times(1)).save(mockOrder);
    }

    @Test
    void testCancelOrder_AlreadyShipped() {
        User mockUser = new User();
        mockUser.setAdmin(true);
        when(authentication.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));

        Order mockOrder = new Order();
        mockOrder.setStatus("SHIPPED");
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        ResponseEntity<?> response = orderResource.cancelOrder(1);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Order cannot be canceled as it has already been shıpped", response.getBody());
        verify(orderRepository, never()).save(mockOrder);
    }
}
