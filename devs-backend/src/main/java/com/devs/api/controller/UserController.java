package com.devs.api.controller;

import com.devs.api.dto.UserDTO;
import com.devs.api.entity.Role;
import com.devs.api.entity.User;
import com.devs.api.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> uploadUser(@RequestParam("firstName") String firstName,
                                             @RequestParam("lastName") String lastName,
                                             @RequestParam("username") String username,
                                             @RequestParam("email") String email,
                                             @RequestParam("university") String university,
                                             @RequestParam("country") String country,
                                             @RequestParam("occupation") String occupation,
                                             @RequestParam("password") String password,
                                             @RequestParam("role") String role,
                                             Authentication authentication) {

        try {
            User user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setUsername(username);
            user.setOccupation(occupation);
            user.setCountry(country);
            user.setUniversity(university);
            user.setEmail(email);
            user.setCreateDate(new Date());
            String hashedPassword = passwordEncoder.encode(password);
            user.setPassword(hashedPassword);

            switch (role) {
                case "ADMIN" -> user.setRole(Role.ADMIN);
                default -> user.setRole(Role.USER);
            }

            userService.save(user);
            return ResponseEntity.ok("User uploaded successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in uploadUser: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateUser(@PathVariable("userId") Long userId,
                                             @RequestParam("firstName") String firstName,
                                             @RequestParam("lastName") String lastName,
                                             @RequestParam("username") String username,
                                             @RequestParam("email") String email,
                                             @RequestParam("role") String role,
                                             Authentication authentication) {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User existingUser = optionalUser.get();

        if (firstName != null) {
            existingUser.setFirstName(firstName);
        }

        if (lastName != null) {
            existingUser.setLastName(lastName);
        }

        if (username != null) {
            existingUser.setUsername(username);
        }

        if (email != null) {
            existingUser.setEmail(email);
        }

        if (role != null) {
            switch (role) {
                case "ADMIN" -> existingUser.setRole(Role.ADMIN);
                default -> existingUser.setRole(Role.USER);
            }
        }

        existingUser.setUpdateDate(new Date());
        userService.save(existingUser);

        return ResponseEntity.ok("User updated successfully!");
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteUserById(@PathVariable Long userId) {
        try {
            Optional<User> optionalUser = userService.findById(userId);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            User user = optionalUser.get();
            user.setDeleteDate(new Date());
            userService.save(user);

            return ResponseEntity.ok("User deleted successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in deleteUserById: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user.");
        }
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long userId, Authentication authentication) {
        try {
            User user = userService.findUserById(userId);
            if (user != null) {
                UserDTO userDTO = convertToUserDTO(user);
                return ResponseEntity.ok(userDTO);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            LOGGER.error("Error in getUser: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDTO>> getUsers(Authentication authentication) {
        try {
            List<User> users = userService.getUsers();
            List<UserDTO> userDTOs = users.stream()
                    .map(this::convertToUserDTO).toList();
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            LOGGER.error("Error in getUsers: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setUsername(user.getUsername());
        userDTO.setCountry(user.getCountry());
        userDTO.setOccupation(user.getOccupation());
        userDTO.setUniversity(user.getUniversity());
        userDTO.setRole(user.getRole().toString());
        userDTO.setDeleteDate(user.getDeleteDate());
        return userDTO;
    }
}