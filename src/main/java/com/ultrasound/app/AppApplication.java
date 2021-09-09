package com.ultrasound.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

//	@Bean
//	CommandLineRunner run (VideoClassificationServiceImpl classificationService ) {
//		return args -> {
//			classificationService.saveClassification(new VideoClassification("ECHO", new HashSet<>()));
//			classificationService.saveClassification(new VideoClassification("LUNG", new HashSet<>()));
//			classificationService.saveClassification(new VideoClassification("DVT", new HashSet<>()));
//
//			roleRepo.saveCategory(new VideoCategory("Subclavian_Axillary"));
//			categoryService.saveCategory(new VideoCategory("Consolidation"));
//			categoryService.saveCategory(new VideoCategory("Heart"));

//			roleRepo.save(new Role(ERole.ROLE_USER));
//			roleRepo.save(new Role(ERole.ROLE_ADMIN));

//			service.addRoleToUser("calebtracey", "ROLE_USER");
//			service.addRoleToUser("admin", "ROLE_ADMIN");
//		};
	}

