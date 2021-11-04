package com.ultrasound.app.aws.util;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.S3Resource;
import com.amazonaws.services.s3.internal.S3DirectSpi;
import com.amazonaws.services.s3.model.*;
import com.ultrasound.app.aws.S3Service;
import com.ultrasound.app.model.data.ListItem;
import com.ultrasound.app.payload.response.MessageResponse;
import com.ultrasound.app.service.ClassificationServiceImpl;
import com.ultrasound.app.service.SubMenuServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class S3UtilsImpl implements S3Utils {

    private final AmazonS3Client s3Client;
    private final String BUCKET_NAME = "ultrasound-files";
    //    private final String BUCKET_NAME = "ultrasound-test-2";

    @Autowired
    private ClassificationServiceImpl classificationService;
    @Autowired
    private SubMenuServiceImpl subMenuService;

    private ListObjectsV2Result listObjectsV2() {
        return s3Client.listObjectsV2(BUCKET_NAME);
    }

    public S3UtilsImpl(AmazonS3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public MessageResponse cleanBucketFileExtensions() {
        AtomicInteger count = new AtomicInteger();

        listObjectsV2().getObjectSummaries().forEach(objectSummary -> {
            if (!usableExtensions(objectSummary)) {
                s3Client.deleteObject(
                        new DeleteObjectRequest(BUCKET_NAME, objectSummary.getKey()));
                count.getAndIncrement();
            }
        });
        return new MessageResponse("Deleted " + count + " non-mp4 files");
    }

    @Override
    public MessageResponse updateFileNamesAndExport() {
        AtomicInteger fileCount = new AtomicInteger();
        classificationService.all().forEach(classification -> {
            if (classification.getHasSubMenu()) {
                classificationService.subMenuObjects(classification.getSubMenus())
                        .forEach(subMenu -> {
                    subMenu.getItemList().forEach(listItem -> {
                        String newFileName = StringUtils.join(new String[]{
                                classification.getName(), subMenu.getName(), listItem.getName(), ".mp4"}, " - ");
                        pushToBucket(newFileName, listItem.getLink());
                        fileCount.getAndIncrement();
                    });
                });
            }
            classification.getListItems().forEach(listItem -> {
                String newFileName = StringUtils.join(new String[]{
                        classification.getName(), listItem.getName(), ".mp4"}, " - ");
                pushToBucket(newFileName, listItem.getLink());
                fileCount.getAndIncrement();
            });
        });

        return new MessageResponse("Exported " + fileCount + " files");
    }

    private void pushToBucket(String newKey, String oldKey) {
        S3Object oldFile = s3Client.getObject(BUCKET_NAME, oldKey);
        String EXPORT_BUCKET_NAME = "ultrasound-files-export";
        s3Client.putObject(EXPORT_BUCKET_NAME, newKey, oldFile.getObjectContent().getDelegateStream(), oldFile.getObjectMetadata());
    }

    private @NotNull Boolean usableExtensions(@NotNull S3ObjectSummary objectSummary) {
        return FilenameUtils.isExtension(objectSummary.getKey(), "mp4");
    }

}
