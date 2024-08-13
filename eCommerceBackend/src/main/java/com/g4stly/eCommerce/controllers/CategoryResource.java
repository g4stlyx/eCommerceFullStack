package com.g4stly.eCommerce.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.g4stly.eCommerce.models.Category;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.CategoryRepository;
import com.g4stly.eCommerce.repositories.UserRepository;

@RestController
public class CategoryResource {

    private CategoryRepository categoryRepository;
    private UserRepository userRepository;

    CategoryResource(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/categories/{category_id}")
    public ResponseEntity<?> getCategoryById(@PathVariable String category_id) {
        try {
            Optional<Category> categoryOpt = categoryRepository.findById(Integer.parseInt(category_id));
            if (!categoryOpt.isPresent()) {
                throw new NotFoundException();
            }
            return new ResponseEntity<>(categoryOpt.get(), HttpStatus.CREATED);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!currentUser.isAdmin()) {
                return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
            }

            Category savedCategory = categoryRepository.save(category);
            return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/categories/{category_id}")
    public ResponseEntity<?> updateCategory(@PathVariable String category_id, @RequestBody Category categoryDetails) {
        try {
            Category category = categoryRepository.findById(Integer.parseInt(category_id))
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!currentUser.isAdmin()) {
                return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
            }

            category.setName(categoryDetails.getName());
            category.setDescription(categoryDetails.getDescription());
            category.setImgSrc(categoryDetails.getImgSrc());
            category.setProducts(categoryDetails.getProducts());

            Category updatedCategory = categoryRepository.save(category);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/categories/{category_id}")
    public ResponseEntity<?> deleteById(@PathVariable Integer category_id) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!currentUser.isAdmin()) {
                return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
            }
            
            categoryRepository.deleteById(category_id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
