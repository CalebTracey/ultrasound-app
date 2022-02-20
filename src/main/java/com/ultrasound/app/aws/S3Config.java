package com.ultrasound.app.aws;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cloudformation.AmazonCloudFormation;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Builder;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.BucketCrossOriginConfiguration;
import com.amazonaws.services.s3.model.CORSRule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.http.async.SdkAsyncHttpClient;
import software.amazon.awssdk.http.nio.netty.NettyNioAsyncHttpClient;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Configuration
public class S3Config {
    // TODO uncomment for prod

//        private static AWSCredentialsProviderImpl credentialsProvider;

    @Bean
    public static AmazonS3 amazonS3Client() throws IOException {
        BucketCrossOriginConfiguration configuration = new BucketCrossOriginConfiguration();

        List<CORSRule.AllowedMethods> rule1AM = new ArrayList<>();
        rule1AM.add(CORSRule.AllowedMethods.PUT);
        rule1AM.add(CORSRule.AllowedMethods.POST);
        rule1AM.add(CORSRule.AllowedMethods.DELETE);
        CORSRule rule1 = new CORSRule().withId("CORSRule1").withAllowedMethods(rule1AM)
                .withAllowedOrigins(List.of("http://localhost:3000", "http://localhost"));
        List<CORSRule> rules = new ArrayList<>();
        rules.add(rule1);
        configuration.setRules(rules);
        AmazonS3 s3Client = null;
        try {
            s3Client = AmazonS3ClientBuilder.standard()
                    .withRegion(Regions.US_EAST_1)
                    .withCredentials(new DefaultAWSCredentialsProviderChain()) //dev
//                .withCredentials(credentialsProvider) //prod
                    .build();

            String BUCKET_NAME = "ultrasound-files";
            s3Client.setBucketCrossOriginConfiguration(BUCKET_NAME, configuration);
            
        } catch (AmazonServiceException e) {
            log.error("AmazonServiceException: {}", e.getErrorMessage());
            // The call was transmitted successfully, but Amazon S3 couldn't process
            // it, so it returned an error response.
            e.printStackTrace();
        } catch (SdkClientException e) {
            log.error("SdkClientException: {}", e.getLocalizedMessage());
            // Amazon S3 couldn't be contacted for a response, or the client
            // couldn't parse the response from Amazon S3.
            e.printStackTrace();
        }
        return s3Client;
    }

}
