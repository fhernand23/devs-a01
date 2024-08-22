package com.devs.api.controller;

import com.devs.api.dto.AuthenticationRequest;
import com.devs.api.dto.AuthenticationResponse;
import com.devs.api.dto.RegisterRequest;
import com.devs.api.entity.Role;
import com.devs.api.entity.User;
import com.devs.api.service.impl.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            LOGGER.info("Received registration request: {}", request.getEmail());
            AuthenticationResponse response = authenticationService.register(request);
            LOGGER.info("Registration completed for user: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (AuthenticationService.RegistrationException e) {
            LOGGER.error("Registration failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            LOGGER.error("Registration failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/refreshToken")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        authenticationService.refreshToken(request, response);
    }

    @PostMapping("/registerAdmin")
    public ResponseEntity<AuthenticationResponse> registerAdmin(
            Authentication authentication,
            @RequestBody RegisterRequest request
    ) {
        User user = (User) authentication.getPrincipal();
        if (user.getRole() == Role.ADMIN) {
            try {
                LOGGER.info("Received registration request: {}", request);
                AuthenticationResponse response = authenticationService.registerAdmin(request);
                LOGGER.info("Registration completed for user: {}", request.getEmail());
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                LOGGER.error("Registration failed: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        try {
            LOGGER.info("Received authentication request: {}", request.getUsername());
            AuthenticationResponse response = authenticationService.authenticate(request);
            LOGGER.info("Authentication completed for user: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOGGER.error("Authentication failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
