package com.g4stly.restApi.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity(name="users")
public class User {
    public User(){}

    @Id
    @GeneratedValue
    private Integer id;

    @NotNull
    @Size(min=3, max=20, message="Username must be between 3 and 20 characters long.")
    @Pattern(regexp = "^[a-zA-Z0-9_.]+$", message = "Username can only contain letters, numbers, underscores, or dots")
    @Pattern(regexp = "^(?!.*([_.])\\1).*$", message = "Username must not contain consecutive dots or underscores")
    @Pattern(regexp = "^(?![_.]).*$", message = "Username must not start or end with a dot or underscore")
    @Column(unique = true)
    private String username;

    @NotNull
    private String password;

    private boolean isAdmin;

    public User(Integer id, String username, String password, boolean isAdmin) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}
    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}
    public boolean isAdmin() {return isAdmin;}
    public void setAdmin(boolean isAdmin) {this.isAdmin = isAdmin;}

    @Override
    public String toString() {
        return "User [id=" + id + ", username=" + username + ", password=" + password + ", isAdmin=" + isAdmin + "]";
    }

}
