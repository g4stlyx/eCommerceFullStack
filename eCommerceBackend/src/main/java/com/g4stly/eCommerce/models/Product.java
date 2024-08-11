package com.g4stly.eCommerce.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name="products")
public class Product {

    public Product(){}

    @Id 
    @GeneratedValue
    private Integer id;

    @Column(name="image_source")
    private String imgSrc;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties("products")  // Prevents serialization of the products field in the Category class
    private Category category;

    private String name;
    private String description;
    private int quantity;
    private double price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Product(Integer id, String imgSrc, Category category, String name, String description, int quantity,
            double price, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.imgSrc = imgSrc;
        this.category = category;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
    public String getImgSrc() {return imgSrc;}
    public void setImgSrc(String imgSrc) {this.imgSrc = imgSrc;}
    public Category getCategory() {return category;}
    public void setCategory(Category category) {this.category = category;}
    public int getQuantity() {return quantity;}
    public void setQuantity(int quantity) {this.quantity = quantity;}
    public double getPrice() {return price;}
    public void setPrice(double price) {this.price = price;}
    public LocalDateTime getCreatedAt() {return createdAt;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
    public LocalDateTime getUpdatedAt() {return updatedAt;}
    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt;}

    @Override
    public String toString() {
        return "Product [id=" + id + ", imgSrc=" + imgSrc + ", category=" + category + ", name=" + name
                + ", description=" + description + ", quantity=" + quantity + ", price=" + price + ", createdAt="
                + createdAt + ", updatedAt=" + updatedAt + "]";
    }

}
