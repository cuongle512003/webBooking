package com.group.prj.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.prj.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(final String role);

    boolean existsByName(String role);

}
