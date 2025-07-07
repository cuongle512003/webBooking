package com.group.prj.security;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import com.group.prj.security.jwt.AuthTokenFilter;
import com.group.prj.security.jwt.JwtAuthEntryPoint;
import com.group.prj.security.user.HotelUserDetailsService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class WebSecurityConfig {

    private final HotelUserDetailsService userDetailsService;
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    @Bean
    public AuthTokenFilter authenticationTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // create new role admin
    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // http.csrf(AbstractHttpConfigurer::disable)
    // .exceptionHandling(exception ->
    // exception.authenticationEntryPoint(jwtAuthEntryPoint))
    // .sessionManagement(session ->
    // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    // .authorizeHttpRequests(auth -> auth
    // .requestMatchers("/auth/**", "/rooms/**", "/bookings/**").permitAll()
    // .requestMatchers(HttpMethod.POST,
    // "/roles/create-new-role")
    // .permitAll()
    // // // ✅ CHO PHÉP POST
    // .requestMatchers(HttpMethod.DELETE, "/user/delete/**").hasAnyRole("ADMIN",
    // "USER") // Fix quyền
    // // DELETE
    // .requestMatchers("/roles/**").hasRole("ADMIN") // Các API khác vẫn yêu cầu
    // // ADMIN
    // .requestMatchers("/user/**").authenticated()
    // .anyRequest().authenticated());
    // }

    // http.csrf(AbstractHttpConfigurer::disable)
    // .exceptionHandling(exception ->
    // exception.authenticationEntryPoint(jwtAuthEntryPoint))
    // .sessionManagement(session ->
    // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    // .authorizeHttpRequests(auth -> auth
    // .requestMatchers("/auth/**", "/rooms/**", "/bookings/**").permitAll()
    // .requestMatchers(HttpMethod.DELETE, "/user/delete/**").hasAnyRole("ADMIN",
    // "USER")
    // .requestMatchers("/roles/**").hasRole("ADMIN")
    // .requestMatchers("/user/**").authenticated()
    // .anyRequest().authenticated());
    // http.authenticationProvider(authenticationProvider());
    // http.addFilterBefore(authenticationTokenFilter(),
    // UsernamePasswordAuthenticationFilter.class);
    // return http.build();

    // }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer :: disable)
                .exceptionHandling(
                        exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/rooms/**","/bookings/**")
                        .permitAll().requestMatchers("/roles/**").hasRole("ADMIN")
                        .anyRequest().authenticated());
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedMethods("GET", "PUT", "POST", "DELETE",
                        "PATCH", "OPTIONS", "HEAD");
            }
        };
    }

    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    // CorsConfiguration config = new CorsConfiguration();
    // config.setAllowedOrigins(List.of("http://localhost:5173"));
    // config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    // config.setAllowedHeaders(List.of("*"));
    // config.setAllowCredentials(true); // Cho phép credentials
    // config.setExposedHeaders(List.of("Authorization")); // Nếu có header như
    // // Authorization cần phải expose

    // UrlBasedCorsConfigurationSource source = new
    // UrlBasedCorsConfigurationSource();
    // source.registerCorsConfiguration("/**", config);
    // return source;
    // }

}
