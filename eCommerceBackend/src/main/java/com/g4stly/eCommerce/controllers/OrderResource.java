package com.g4stly.eCommerce.controllers;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.g4stly.eCommerce.models.Order;
import com.g4stly.eCommerce.models.OrderItem;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.OrderRepository;
import com.g4stly.eCommerce.repositories.UserRepository;

@RestController
@CrossOrigin("http://localhost:5173")
public class OrderResource {

    private OrderRepository orderRepository;
    private UserRepository userRepository;

    OrderResource(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!user.isAdmin()) {
                return new ResponseEntity<>("You are not authorized to view this resource: getting all orders",
                        HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<>(orderRepository.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!user.isAdmin() && !order.getUser().getUsername().equals(username)) {
                return new ResponseEntity<>("You are not authorized to view this resource: getting order by id " + id,
                        HttpStatus.UNAUTHORIZED);
            }

            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Order orderDetails) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            orderDetails.setUser(user);
            orderDetails.setOrderDate(LocalDateTime.now());

            double totalPrice = 0;
            for (OrderItem item : orderDetails.getOrderItems()) {
                totalPrice += item.getProduct().getPrice() * item.getQuantity();
                item.setOrder(orderDetails);
            }
            orderDetails.setTotalPrice(totalPrice);
            
            //! order status değiştirmeden önce user'ın parasını vs kontrol etmeli
            orderDetails.setStatus("CREATED");

            Order savedOrder = orderRepository.save(orderDetails);
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id){
        try{
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!user.isAdmin() && !order.getUser().getUsername().equals(username)) {
                return new ResponseEntity<>("You are not authorized to view this resource: canceling order by id " + id,
                        HttpStatus.UNAUTHORIZED);
            }

            if (order.getStatus().equalsIgnoreCase("SHIPPED") || order.getStatus().equalsIgnoreCase("DELIVERED")) {
                return new ResponseEntity<>("Order cannot be canceled as it has already been " + order.getStatus().toLowerCase(),
                        HttpStatus.BAD_REQUEST);
            }

            order.setStatus("CANCELED");
            Order savedOrder = orderRepository.save(order);
            return new ResponseEntity<>(savedOrder, HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("An error occurred: " + e.getMessage());
        }
    }

}
