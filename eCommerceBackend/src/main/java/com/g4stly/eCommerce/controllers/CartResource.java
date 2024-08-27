package com.g4stly.eCommerce.controllers;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

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

import com.g4stly.eCommerce.models.Cart;
import com.g4stly.eCommerce.models.CartItem;
import com.g4stly.eCommerce.models.Order;
import com.g4stly.eCommerce.models.OrderItem;
import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.UpdateQuantityRequest;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.CartItemRepository;
import com.g4stly.eCommerce.repositories.CartRepository;
import com.g4stly.eCommerce.repositories.OrderRepository;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.UserRepository;

@RestController
@CrossOrigin("http://localhost:5173")
public class CartResource {

    private UserRepository userRepository;
    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;
    private ProductRepository productRepository;
    private OrderRepository orderRepository;

    public CartResource(CartRepository cartRepository, CartItemRepository cartItemRepository,
            UserRepository userRepository, ProductRepository productRepository, OrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCart() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = user.getCart();
        if (cart == null) {
            return new ResponseEntity<>("Your cart is empty :(", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @GetMapping("/cart/{id}")
    public ResponseEntity<?> getCartById(@PathVariable Integer id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (!user.isAdmin() && !cart.getUser().getUsername().equals(username)) {
            return new ResponseEntity<>("You are not authorized to view this resource: getting cart by id " + id,
                    HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PostMapping("/cart/{productId}")
    public ResponseEntity<?> addItemToCart(@PathVariable Integer productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        Cart cart = null;
        if (cartOpt.isPresent()) {
            cart = cartOpt.get();
        } else {
            cart = new Cart();
            List<CartItem> cartItems = new ArrayList<CartItem>();
            cart.setUser(user);
            cart.setCartItems(cartItems);
            cartRepository.save(cart);
        }
        CartItem item = new CartItem();
        for (CartItem cartItem : cart.getCartItems()) {
            Product productToCheck = cartItem.getProduct();
            if (productToCheck.getId().equals(productId)) {
                cartItem.setQuantity(cartItem.getQuantity() + 1);
                return new ResponseEntity<>(cart, HttpStatus.OK);
            }
        }
        item.setProduct(product);
        item.setCart(cart);
        item.setQuantity(1);
        cartItemRepository.save(item);
        cart.getCartItems().add(item);
        cartRepository.save(cart);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @DeleteMapping("/cart/{cartItemId}")
    public void removeItemFromCart(@PathVariable Integer cartItemId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            CartItem itemToRemove = null;
            for (CartItem item : cart.getCartItems()) {
                if (item.getId().equals(cartItemId)) {
                    itemToRemove = item;
                    break;
                }
            }
            if (itemToRemove != null) {
                cart.getCartItems().remove(itemToRemove);
                cartItemRepository.delete(itemToRemove);
                cartRepository.save(cart);
            }
            if (itemToRemove == null) {
                throw new RuntimeException("Item with id " + cartItemId + " couldn't be found in your cart");
            }
        }
    }

    @PutMapping("/cart/{cartItemId}/quantity")
    public ResponseEntity<?> updateCartItemQuantity(@PathVariable Integer cartItemId, @RequestBody UpdateQuantityRequest updateQuantityRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        if (!user.isAdmin() && !item.getCart().getUser().getUsername().equals(username)) {
            return new ResponseEntity<>("You are not authorized to modify this resource: updating cart item quantity",
                    HttpStatus.UNAUTHORIZED);
        }

        item.setQuantity(updateQuantityRequest.getQuantity());
        cartItemRepository.save(item);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    @PostMapping("/cart/{cartId}/order")
    public ResponseEntity<?> createOrderFromCart(@PathVariable Integer cartId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (!user.isAdmin() && !cart.getUser().getUsername().equals(username)) {
            return new ResponseEntity<>("You are not authorized to create an order from this cart",
                    HttpStatus.UNAUTHORIZED);
        }

        Order order = new Order();
        order.setUser(user);
        orderRepository.save(order);

        // converting CartItems to OrderItems and add them to the order
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            if(order.getOrderItems() == null){
                order.setOrderItems(new ArrayList<>());
            }
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            order.getOrderItems().add(orderItem);
        }
        orderRepository.save(order);

        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CREATED");

        double totalPrice = 0;
        for (OrderItem item : order.getOrderItems()) {
            totalPrice += item.getProduct().getPrice() * item.getQuantity();
            item.setOrder(order);
        }
        order.setTotalPrice(totalPrice);

        orderRepository.save(order);

        //TODO: doesnt remove cart items after cart transformed into an order. does not break the app but may be annoying
        for (CartItem cartItem : cart.getCartItems()) {
            cartItemRepository.delete(cartItem);
        }
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

}
