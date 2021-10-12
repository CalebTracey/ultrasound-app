package com.ultrasound.app.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.ultrasound.app.AppApplication;
import com.ultrasound.app.model.data.ListItem;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.event.annotation.BeforeTestMethod;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@ExtendWith(MockitoExtension.class)
class S3RepositoryTest {

    @Mock
    private AmazonS3Client config;
    @Mock
    private AutoCloseable autoCloseable;
    @Mock
    private S3ServiceImpl s3ServiceTest;

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        s3ServiceTest = new S3ServiceImpl(config);
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    private

    @Test
    void shouldParseFileNamesToMap() {


    }


}