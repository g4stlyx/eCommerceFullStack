package com.g4stly.eCommerce.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.g4stly.eCommerce.models.Category;
import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.CategoryRepository;
import com.g4stly.eCommerce.repositories.UserRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryResourceTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;
    @InjectMocks
    private CategoryResource categoryResource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @Test
    void testGetAllCategories() {
        Category category1 = new Category();
        Category category2 = new Category();
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        ResponseEntity<?> response = categoryResource.getAllCategories();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, ((List<?>) response.getBody()).size());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void testGetCategoryById_Success() {
        Category mockCategory = new Category();
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));

        ResponseEntity<?> response = categoryResource.getCategoryById("1");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(mockCategory, response.getBody());
        verify(categoryRepository, times(1)).findById(1);
    }

    @Test
    void testGetCategoryById_NotFound() {
        when(categoryRepository.findById(1)).thenReturn(Optional.empty());

        ResponseEntity<?> response = categoryResource.getCategoryById("1");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Category not found", response.getBody());
        verify(categoryRepository, times(1)).findById(1);
    }

    @Test
    void testCreateCategory_AsAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(true);
        when(authentication.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));

        Category category = new Category();
        when(categoryRepository.save(category)).thenReturn(category);

        ResponseEntity<?> response = categoryResource.createCategory(category);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(category, response.getBody());
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    void testCreateCategory_AsNonAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(false);
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        Category category = new Category();

        ResponseEntity<?> response = categoryResource.createCategory(category);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access denied", response.getBody());
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void testUpdateCategory_AsAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(true);
        when(authentication.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));

        Category existingCategory = new Category();
        Category updatedCategory = new Category();
        when(categoryRepository.findById(1)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.save(existingCategory)).thenReturn(updatedCategory);

        ResponseEntity<?> response = categoryResource.updateCategory("1", updatedCategory);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedCategory, response.getBody());
        verify(categoryRepository, times(1)).findById(1);
        verify(categoryRepository, times(1)).save(existingCategory);
    }

    @Test
    void testUpdateCategory_AsNonAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(false);
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        Category existingCategory = new Category();
        Category updatedCategory = new Category();
        when(categoryRepository.findById(1)).thenReturn(Optional.of(existingCategory));

        ResponseEntity<?> response = categoryResource.updateCategory("1", updatedCategory);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access denied", response.getBody());
        verify(categoryRepository, times(1)).findById(1);
        verify(categoryRepository, never()).save(existingCategory);
    }

    @Test
    void testDeleteCategory_AsAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(true);
        when(authentication.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));

        ResponseEntity<?> response = categoryResource.deleteById(1);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(categoryRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteCategory_AsNonAdmin() {
        User mockUser = new User();
        mockUser.setAdmin(false);
        when(authentication.getName()).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(mockUser));

        ResponseEntity<?> response = categoryResource.deleteById(1);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access denied", response.getBody());
        verify(categoryRepository, never()).deleteById(1);
    }
}

