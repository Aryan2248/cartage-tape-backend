package com.example.cartagetape.service;

import com.example.cartagetape.dto.AuthResponse;
import com.example.cartagetape.dto.LoginRequest;
import com.example.cartagetape.dto.RegisterRequest;
import com.example.cartagetape.dto.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser();
}