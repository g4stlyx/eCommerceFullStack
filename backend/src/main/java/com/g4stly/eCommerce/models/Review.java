package com.g4stly.eCommerce.models;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name= "reviews")
public class Review {
    @Id 
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int star;
    private String title;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Review(Integer id, User user, Product product, int star, String title, String text, LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.star = star;
        this.title = title;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}
    public Product getProduct() {return product;}
    public void setProduct(Product product) {this.product = product;}
    public int getStar() {return star;}
    public void setStar(int star) {this.star = star;}
    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}
    public String getText() {return text;}
    public void setText(String text) {this.text = text;}
    public LocalDateTime getCreatedAt() {return createdAt;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
    public LocalDateTime getUpdatedAt() {return updatedAt;}
    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt;}

    @Override
    public String toString() {
        return "Review [id=" + id + ", user=" + user + ", product=" + product + ", star=" + star + ", title=" + title
                + ", text=" + text + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
    }


}
