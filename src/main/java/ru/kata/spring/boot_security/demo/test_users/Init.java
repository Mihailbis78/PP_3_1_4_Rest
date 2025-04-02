package ru.kata.spring.boot_security.demo.test_users;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.*;

@Component
public class Init {
    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public Init(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    private void init() {
        if (roleService.findRoleByName("USER") == null) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleService.saveRole(userRole);
            System.out.println("Role User created");
        } else {
            System.out.println("Role USER Not created!");
        }

        if (roleService.findRoleByName("ADMIN") == null) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleService.saveRole(adminRole);
            System.out.println("Role ADMIN created");
        }
        else {
            System.out.println("ROLE ADMIN NOT CREATED!");
        }

        if (userService.getUserByEmail("user@example.com") == null) {
            User user = new User();
            user.setName("Ivan");
            user.setAge(45);
            user.setEmail("user@example.com");
            user.setPassword("user");
            user.setRoles(new HashSet<>(Collections.singleton(roleService.findRoleByName("USER"))));

            userService.saveUser(user);
            System.out.println(user.getPassword());
        }

        if (userService.getUserByEmail("admin@example.com") == null) {
            User admin = new User();
            admin.setName("Sergey");
            admin.setAge(35);
            admin.setEmail("admin@example.com");
            admin.setPassword(("admin"));

            Set<Role> roles = new HashSet<>();
            roles.add(roleService.findRoleByName("ADMIN"));
            roles.add(roleService.findRoleByName("USER"));

            admin.setRoles(roles);

            userService.saveUser(admin);
            System.out.println(admin.getPassword());
        }
    }
}
