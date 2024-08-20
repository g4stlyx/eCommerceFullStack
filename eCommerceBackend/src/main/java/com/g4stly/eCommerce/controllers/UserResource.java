package com.g4stly.eCommerce.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.Set;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.g4stly.eCommerce.models.User;
import com.g4stly.eCommerce.repositories.UserRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

@RestController
@CrossOrigin("http://localhost:5173")
public class UserResource {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UserResource(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{username}")
    public User getUserById(@PathVariable String username) {
        return userRepository.findByUsername(username).get();
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        System.out.println("Received user: " + user);

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<User>> violations = validator.validate(user);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<User> violation : violations) {
                System.out.println("Violation: " + violation.getMessage());
            }
            return new ResponseEntity<>("Password does not meet the criteria", HttpStatus.BAD_REQUEST);
        }

        try {
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);

            User savedUser = userRepository.save(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            System.out.println("DataIntegrityViolationException: " + e.getMessage());
            return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<User>> violations = validator.validate(user);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<User> violation : violations) {
                System.out.println("Violation: " + violation.getMessage());
            }
            return new ResponseEntity<>("Password does not meet the criteria", HttpStatus.BAD_REQUEST);
        }

        try {
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
            user.setAdmin(false);

            User savedUser = userRepository.save(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            System.out.println("DataIntegrityViolationException: " + e.getMessage());
            return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/users/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @Valid @RequestBody User userDetails) {
        try {
            String usernameWhoUpdate = SecurityContextHolder.getContext().getAuthentication().getName();
            User userWhoUpdate = userRepository.findByUsername(usernameWhoUpdate)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            User usertoUpdate = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            usertoUpdate.setEmail(userDetails.getEmail());
            usertoUpdate.setPhoneNumber(userDetails.getPhoneNumber());
            usertoUpdate.setAddress(userDetails.getAddress());

            if(userWhoUpdate.isAdmin()){
                usertoUpdate.setAdmin(userDetails.isAdmin());
            }

            String hashedPassword = passwordEncoder.encode(userDetails.getPassword());
            usertoUpdate.setPassword(hashedPassword);
            User updatedUser = userRepository.save(usertoUpdate);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }
        // ! username değiştirilemiyor, bu yüzden tekrar kontrole gerek yok
        // catch (DataIntegrityViolationException e) {
        // return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
        // }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.isAdmin()) {
                return new ResponseEntity<>("You are not authorized to view this resource: deleting user by id " + id,
                        HttpStatus.UNAUTHORIZED);
            }

            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/users/{username}/orders")
    public ResponseEntity<?> getOrdersByUsername(@PathVariable String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!username.equals(currentUsername) && !user.isAdmin()) {
                return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<>(user.getOrders(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}
