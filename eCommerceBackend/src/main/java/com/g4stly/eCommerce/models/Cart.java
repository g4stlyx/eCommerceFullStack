package com.g4stly.eCommerce.models;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity(name= "carts")
public class Cart {

    public Cart(){}

    @Id 
    @GeneratedValue
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart")
    private List<CartItem> cartItems;

    public Cart(Integer id, User user, List<CartItem> cartItems) {
        this.id = id;
        this.user = user;
        this.cartItems = cartItems;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}
    public List<CartItem> getCartItems() {return cartItems;}
    public void setCartItems(List<CartItem> cartItems) {this.cartItems = cartItems;}

    @Override
    public String toString() {
        return "Cart [id=" + id + ", user=" + user + ", cartItems=" + cartItems + "]";
    }

}
