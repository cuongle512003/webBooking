package com.group.prj.util;

import com.group.prj.model.Role;
import com.group.prj.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if ROLE_USER exists, if not, create it
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            Role userRole = new Role("ROLE_USER");
            roleRepository.save(userRole);
            System.out.println("Created ROLE_USER");
        }

        // Check if ROLE_ADMIN exists, if not, create it (optional, but good practice)
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role("ROLE_ADMIN");
            roleRepository.save(adminRole);
            System.out.println("Created ROLE_ADMIN");
        }
    }
} 