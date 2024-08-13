package com.g4stly.eCommerce.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.models.Category;
import com.g4stly.eCommerce.repositories.ProductRepository;
import com.g4stly.eCommerce.repositories.CategoryRepository;

@RestController
public class ProductResource {

    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;

    ProductResource(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/products/{product_id}")
    public ResponseEntity<?> getProductById(@PathVariable String product_id) {
        try {
            Optional<Product> productOpt = productRepository.findById(Integer.parseInt(product_id));
            if (!productOpt.isPresent()) {
                throw new NotFoundException();
            }
            return new ResponseEntity<>(productOpt.get(), HttpStatus.CREATED);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            if (product.getCategory() != null || product.getCategory().getId() != null) {
                Category detaildCategory = categoryRepository.findById(product.getCategory().getId()).get();
                product.setCategory(detaildCategory);
            }

            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());
            Product savedProduct = productRepository.save(product);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/products/{product_id}")
    public ResponseEntity<?> updateProduct(@PathVariable String product_id, @RequestBody Product productDetails) {
        try {
            Product product = productRepository.findById(Integer.parseInt(product_id))
                    .orElseThrow(() -> new RuntimeException("product not found"));

            Category category = product.getCategory();
            if (productDetails.getCategory() != null || productDetails.getCategory().getId() != null) {
                Category detaildCategory = categoryRepository.findById(productDetails.getCategory().getId()).get();
                product.setCategory(detaildCategory);
            } else if (category != null && category.getId() != null) {
                Category existingCategory = categoryRepository.findById(category.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
                product.setCategory(existingCategory);
            }

            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setImgSrc(productDetails.getImgSrc());

            product.setUpdatedAt(LocalDateTime.now());
            Product updatedProduct = productRepository.save(product);
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/products/{product_id}")
    public ResponseEntity<?> deleteById(@PathVariable Integer product_id) {
        try {
            productRepository.deleteById(product_id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/products/search")
    public List<Product> searchAndFilterProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double price_min,
            @RequestParam(required = false) Double price_max) {

        List<Product> products = productRepository.findAll();

        if (q != null && !q.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getName().toLowerCase().contains(q.toLowerCase()) ||
                            product.getDescription().toLowerCase().contains(q.toLowerCase()))
                    .toList();
        }

        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getCategory() != null &&
                            product.getCategory().getName().equalsIgnoreCase(category))
                    .toList();
        }

        if (price_min != null) {
            products = products.stream()
                    .filter(product -> product.getPrice() >= price_min)
                    .toList();
        }

        if (price_max != null) {
            products = products.stream()
                    .filter(product -> product.getPrice() <= price_max)
                    .toList();
        }

        return products;
    }

}
