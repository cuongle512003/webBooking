package com.group.prj.config;

import java.util.List;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.util.unit.DataSize;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.MultipartConfigElement;

public class SecurityConfig {

    // @Bean
    // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
    // Exception {
    // http
    // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    // .csrf(csrf -> csrf.disable())
    // .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // Cho phép tất
    // cả request
    // .sessionManagement(session ->
    // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    // return http.build();
    // }

    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    // CorsConfiguration config = new CorsConfiguration();
    // config.setAllowedOrigins(List.of("http://localhost:5173"));
    // config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    // config.setAllowedHeaders(List.of("*"));
    // config.setAllowCredentials(true); // Cho phép credentials
    // config.setExposedHeaders(List.of("Authorization")); // Nếu có header như
    // Authorization cần phải expose

    // UrlBasedCorsConfigurationSource source = new
    // UrlBasedCorsConfigurationSource();
    // source.registerCorsConfiguration("/**", config);
    // return source;
    // }

    // @Bean
    // public MultipartConfigElement multipartConfigElement() {
    // MultipartConfigFactory factory = new MultipartConfigFactory();
    // factory.setMaxFileSize(DataSize.ofMegabytes(1024)); // Giới hạn file tối đa
    // factory.setMaxRequestSize(DataSize.ofMegabytes(1024)); // Giới hạn tổng thể
    // request size
    // return factory.createMultipartConfig();
    // }
}