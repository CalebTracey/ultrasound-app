package com.ultrasound.app;

import com.ultrasound.app.model.user.AppUser;
import com.ultrasound.app.model.user.ERole;
import com.ultrasound.app.model.user.Role;
import com.ultrasound.app.security.service.UserDetailsServiceImpl;
import com.ultrasound.app.service.AppUserService;
import com.ultrasound.app.service.ClassificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class AppApplication {
//
//	@Autowired
//	PasswordEncoder encoder;

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}
//
//	@Bean
//	CommandLineRunner run(AppUserService userService) {
//		return args -> {
//			Set<Role> roles = new HashSet<>();
//			roles.add(new Role(ERole.ROLE_USER));
//			roles.add(new Role(ERole.ROLE_ADMIN));
//			userService.save(new AppUser("Admin", "admin", encoder.encode("admin123"), "admin.email.com", roles));
//		};
//	}
}

