package com.g4stly.eCommerce.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.g4stly.eCommerce.models.Category;
import com.g4stly.eCommerce.models.Product;
import com.g4stly.eCommerce.repositories.CategoryRepository;
import com.g4stly.eCommerce.repositories.ProductRepository;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

class ProductResourceTest {

    @InjectMocks
    private ProductResource productResource;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProducts() {
        List<Product> mockProducts = new ArrayList<>();
        when(productRepository.findAll()).thenReturn(mockProducts);

        List<Product> products = productResource.getAllProducts();

        assertNotNull(products);
        assertEquals(mockProducts, products);
    }

    @Test
    void testGetProductById_Found() {
        Integer productId = 1;
        Product mockProduct = new Product();
        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        ResponseEntity<?> response = productResource.getProductById(productId.toString());

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(mockProduct, response.getBody());
    }

    @Test
    void testGetProductById_NotFound() {
        Integer productId = 1;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = productResource.getProductById(productId.toString());

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Product not found", response.getBody());
    }

    @Test
    void testCreateProduct_Valid() {
        Category mockCategory = new Category();
        mockCategory.setId(1);
        Product mockProduct = new Product();
        mockProduct.setCategory(mockCategory);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(mockProduct)).thenReturn(mockProduct);

        ResponseEntity<?> response = productResource.createProduct(mockProduct);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(productRepository, times(1)).save(mockProduct);
    }

    @Test
    void testUpdateProduct_Valid() {
        Integer productId = 1;
        Category mockCategory = new Category();
        mockCategory.setId(1);

        Product existingProduct = new Product();
        existingProduct.setCategory(mockCategory);

        Product updatedProductDetails = new Product();
        updatedProductDetails.setName("Updated Product");
        updatedProductDetails.setDescription("Updated Description");
        updatedProductDetails.setImgSrc("updated.jpg");
        updatedProductDetails.setCategory(mockCategory);

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(existingProduct)).thenReturn(existingProduct);

        ResponseEntity<?> response = productResource.updateProduct(productId.toString(), updatedProductDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(productRepository, times(1)).save(existingProduct);
        assertEquals("Updated Product", existingProduct.getName());
        assertEquals("Updated Description", existingProduct.getDescription());
        assertEquals("updated.jpg", existingProduct.getImgSrc());
    }

    @Test
    void testDeleteProduct_Valid() {
        Integer productId = 1;

        doNothing().when(productRepository).deleteById(productId);

        ResponseEntity<?> response = productResource.deleteById(productId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    void testSearchAndFilterProducts() {
        List<Product> mockProducts = new ArrayList<>();
        Product product1 = new Product();
        product1.setName("Product 1");
        product1.setDescription("Description 1");
        product1.setPrice(100.0);
        mockProducts.add(product1);

        Product product2 = new Product();
        product2.setName("Product 2");
        product2.setDescription("Description 2");
        product2.setPrice(200.0);
        mockProducts.add(product2);

        when(productRepository.findAll()).thenReturn(mockProducts);

        List<Product> result = productResource.searchAndFilterProducts("Product 1", null, null, null);

        assertEquals(1, result.size());
        assertEquals("Product 1", result.get(0).getName());
    }

    @Test
    void testSearchAndFilterProducts_Category() {
        List<Product> mockProducts = new ArrayList<>();
        Category category1 = new Category();
        category1.setName("Category 1");

        Product product1 = new Product();
        product1.setName("Product 1");
        product1.setCategory(category1);
        mockProducts.add(product1);

        when(productRepository.findAll()).thenReturn(mockProducts);

        List<Product> result = productResource.searchAndFilterProducts(null, "Category 1", null, null);

        assertEquals(1, result.size());
        assertEquals("Product 1", result.get(0).getName());
    }
}