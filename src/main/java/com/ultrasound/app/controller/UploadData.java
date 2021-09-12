package com.ultrasound.app.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadData {

    private String category;
    private String classification;
    private String superCategory;
    private String subCategory;
    private MultipartFile file;

    public UploadData(String category, String classification) {
        this.category = category;
        this.classification = classification;
    }
}
