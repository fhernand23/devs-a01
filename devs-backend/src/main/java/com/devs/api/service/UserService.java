package com.devs.api.service;

import com.devs.api.entity.Model;
import com.devs.api.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {

    void save(User user);

    void deleteUserById(Long userId);

    List<User> getUsers();

    Optional<User> findById(Long userId);

    User findUserById(Long modelId);
}
