package com.g4stly.eCommerce.models;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity(name= "wishlist")
public class Wishlist {

    Wishlist(){}

    @Id 
    @GeneratedValue
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "wishlist")
    private List<WishlistItem> wishlistItems;

    public Wishlist(Integer id, User user, List<WishlistItem> wishlistItems) {
        this.id = id;
        this.user = user;
        this.wishlistItems = wishlistItems;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}
    public List<WishlistItem> getWishlistItems() {return wishlistItems;}
    public void setWishlistItems(List<WishlistItem> wishlistItems) {this.wishlistItems = wishlistItems;}

    @Override
    public String toString() {
        return "Wishlist [id=" + id + ", user=" + user + ", wishlistItems=" + wishlistItems + "]";
    }

}
