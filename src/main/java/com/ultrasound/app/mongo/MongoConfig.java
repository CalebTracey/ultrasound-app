package com.ultrasound.app.mongo;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import java.util.Collection;
import java.util.Collections;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${ultrasound.app.mongoUri}")
    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        return "ultrasound";
    }

    @Override
    protected void configureClientSettings(MongoClientSettings.Builder builder) {
        builder.applyConnectionString(new ConnectionString(mongoUri));
    }

    @Override
    public Collection getMappingBasePackages() {
        return Collections.singleton("com.ultrasound.app");
    }
}
