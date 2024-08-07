package com.g4stly.eCommerce.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name="wishlist_items")
public class WishlistItem {
    @Id 
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "wishlist_id")
    private Wishlist wishlist;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public WishlistItem(Integer id, Wishlist wishlist, Product product) {
        this.id = id;
        this.wishlist = wishlist;
        this.product = product;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public Wishlist getWishlist() {return wishlist;}
    public void setWishlist(Wishlist wishlist) {this.wishlist = wishlist;}
    public Product getProduct() {return product;}
    public void setProduct(Product product) {this.product = product;}

    @Override
    public String toString() {
        return "WishlistItem [id=" + id + ", wishlist=" + wishlist + ", product=" + product + "]";
    }


}

