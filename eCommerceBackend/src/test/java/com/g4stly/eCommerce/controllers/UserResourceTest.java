package com.g4stly.eCommerce.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.g4stly.eCommerce.repositories.UserRepository;
import com.g4stly.eCommerce.models.User;
import java.util.Optional;

class UserResourceTest {

    @InjectMocks
    private UserResource userResource;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testGetAllUsers() {
        userResource.getAllUsers();
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetUserById() {
        String username = "testUser";
        User mockUser = new User();
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));

        User result = userResource.getUserByUsername(username);

        assertEquals(mockUser, result);
    }

    @Test
    void testCreateUser_ValidUser() {
        User user = new User();
        user.setUsername("usernameValid");
        user.setPassword("passwordQ-123");

        when(passwordEncoder.encode(user.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(user)).thenReturn(user);

        ResponseEntity<?> response = userResource.createUser(user);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testCreateUser_UsernameExists() {
        User user = new User();
        user.setUsername("usernameValid");
        user.setPassword("passwordQ-123");

        when(passwordEncoder.encode(user.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(user)).thenThrow(new DataIntegrityViolationException("Username already exists"));

        ResponseEntity<?> response = userResource.createUser(user);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void testSignup_ValidUser() {
        User user = new User();
        user.setUsername("usernameValid");
        user.setPassword("passwordQ-123");

        when(passwordEncoder.encode(user.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(user)).thenReturn(user);

        ResponseEntity<?> response = userResource.signup(user);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testDeleteById_NotAdmin() {
        String username = "testUser";
        User user = new User();
        user.setAdmin(false);

        when(authentication.getName()).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userResource.deleteById(1);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(userRepository, times(0)).deleteById(anyInt());
    }

    @Test
    void testGetOrdersByUsername_AccessDenied() {
        String username = "testUser";
        String otherUsername = "otherUser";

        // Mocking the SecurityContext and Authentication
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(username);
        SecurityContextHolder.setContext(securityContext);

        // Mocking the user repository
        User user = new User();
        user.setUsername(otherUsername);
        when(userRepository.findByUsername(otherUsername)).thenReturn(Optional.of(user));

        // Mock current user as a non-admin
        User currentUser = new User();
        currentUser.setUsername(username);
        currentUser.setAdmin(false);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(currentUser));

        // Test the method
        ResponseEntity<?> response = userResource.getOrdersByUsername(otherUsername);

        // Assert that the status is 403 Forbidden
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

}
