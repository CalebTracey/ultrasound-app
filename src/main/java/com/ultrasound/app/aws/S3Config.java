package com.ultrasound.app.aws;

import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    // TODO uncomment for prod
//    @Autowired
//    private static AWSCredentialsProviderImpl credentialsProvider;

    @Bean
    public static AmazonS3Client amazonS3Client() {

        return (AmazonS3Client) AmazonS3ClientBuilder.standard()
                .withRegion("us-east-1")
                .withCredentials(new DefaultAWSCredentialsProviderChain()) //dev
//                .withCredentials(credentialsProvider) //prod
                .build();
    }

}
