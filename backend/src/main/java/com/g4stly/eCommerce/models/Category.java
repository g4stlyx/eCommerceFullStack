package com.g4stly.eCommerce.models;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity(name="categories")
public class Category {
    @Id 
    @GeneratedValue
    private Integer id;

    @OneToMany(mappedBy = "category")
    private List<Product> products;

    private String name;
    private String description;

    @Column(name="image_source")
    private String imgSrc;

    public Category(Integer id, List<Product> products, String name, String description, String imgSrc) {
        this.id = id;
        this.products = products;
        this.name = name;
        this.description = description;
        this.imgSrc = imgSrc;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public List<Product> getProducts() {return products;}
    public void setProducts(List<Product> products) {this.products = products;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
    public String getImgSrc() {return imgSrc;}
    public void setImgSrc(String imgSrc) {this.imgSrc = imgSrc;}

    @Override
    public String toString() {
        return "Category [id=" + id + ", products=" + products + ", name=" + name + ", description=" + description
                + ", imgSrc=" + imgSrc + "]";
    }
    

}
