package com.g4stly.eCommerce.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name= "order_items")
public class OrderItem {

    @Id 
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    public OrderItem(Integer id, Order order, Product product, int quantity) {
        this.id = id;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public Order getOrder() {return order;}
    public void setOrder(Order order) {this.order = order;}
    public Product getProduct() {return product;}
    public void setProduct(Product product) {this.product = product;}
    public int getQuantity() {return quantity;}
    public void setQuantity(int quantity) {this.quantity = quantity;}

    @Override
    public String toString() {
        return "OrderItem [id=" + id + ", order=" + order + ", product=" + product + ", quantity=" + quantity + "]";
    }

}
