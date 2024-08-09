package com.g4stly.eCommerce.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity(name = "orders")
public class Order {
    
    public Order() {}

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"orders", "reviews", "cart", "wishlist"})
    private User user;

    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems;

    private String status;
    private double totalPrice;
    private LocalDateTime orderDate;

    public Order(Integer id, User user, List<OrderItem> orderItems, String status, double totalPrice,
            LocalDateTime orderDate) {
        this.id = id;
        this.user = user;
        this.orderItems = orderItems;
        this.status = status;
        this.totalPrice = totalPrice;
        this.orderDate = orderDate;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}
    public List<OrderItem> getOrderItems() {return orderItems;}
    public void setOrderItems(List<OrderItem> orderItems) {this.orderItems = orderItems;}
    public String getStatus() {return status;}
    public void setStatus(String status) {this.status = status;}public double getTotalPrice() {return totalPrice;}
    public void setTotalPrice(double totalPrice) {this.totalPrice = totalPrice;}
    public LocalDateTime getOrderDate() {return orderDate;}
    public void setOrderDate(LocalDateTime orderDate) {this.orderDate = orderDate;}

    @Override
    public String toString() {
        return "Order [id=" + id + ", user=" + user + ", orderItems=" + orderItems + ", status=" + status
                + ", totalPrice=" + totalPrice + ", orderDate=" + orderDate + "]";
    }


}
