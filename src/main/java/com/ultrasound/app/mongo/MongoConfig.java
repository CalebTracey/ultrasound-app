package com.ultrasound.app.mongo;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import java.util.Collection;
import java.util.Collections;

@Configuration
@PropertySource("classpath:/application-${spring.profiles.active}.properties")

public class MongoConfig extends AbstractMongoClientConfiguration {

    @Autowired
    Environment env;

//    @Value("${ultrasound.app.mongoUri}")
//    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        return "ultrasound";
    }

    @Override
    protected void configureClientSettings(MongoClientSettings.Builder builder) {
        builder.applyConnectionString(new ConnectionString(env.getProperty("ultrasound.app.mongoUri")));
    }

    @Override
    public Collection getMappingBasePackages() {
        return Collections.singleton("com.ultrasound.app");
    }
}
