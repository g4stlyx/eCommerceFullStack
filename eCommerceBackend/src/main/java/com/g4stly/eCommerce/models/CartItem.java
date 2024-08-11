package com.g4stly.eCommerce.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name="cart_items")
public class CartItem {

    public CartItem(){}

    @Id 
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    public CartItem(Integer id, Cart cart, Product product, int quantity) {
        this.id = id;
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public Product getProduct() {return product;}
    public void setProduct(Product product) {this.product = product;}
    public Cart getCart() {return cart;}
    public void setCart(Cart cart) {this.cart = cart;}
    public int getQuantity() {return quantity;}
    public void setQuantity(int quantity) {this.quantity = quantity;}

    @Override
    public String toString() {
        return "CartItem [id=" + id + ", cart=" + cart + ", product=" + product + ", quantity=" + quantity + "]";
    }

}

