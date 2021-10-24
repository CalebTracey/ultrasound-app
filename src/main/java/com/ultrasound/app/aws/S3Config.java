package com.ultrasound.app.aws;

import com.amazonaws.AmazonWebServiceClient;
import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSCredentialsProviderChain;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.services.cloudformation.AmazonCloudFormationAsync;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
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
