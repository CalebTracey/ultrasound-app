package com.ultrasound.app.aws;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;

class S3RepositoryTest {

    @Autowired
    private S3Repository underTest;

    @Test
    void itShouldUpdateFromS3Bucket() {
        //given
        String[] testArray = {
                "ABD - Ascites LUQ -2763607-3_crop.mp4",
                "ABD - Liver hemangioma huge - 2831436.mp4",
                "ABD - Retroperitoneal hemoarrhage - 5380078 - 2_crop.mp4",
                "ABD - SOB_NGT is seen and is blocked - 5719693 - 2_crop.mp4",
                "ABD - Hiatal hernia seen through LUQ - 1847597_crop.mp4"
        };
        //when
        underTest.listObjectsV2();
    }
}