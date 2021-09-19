package com.ultrasound.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


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

