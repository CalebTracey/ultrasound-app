package com.ultrasound.app.model.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "categories")
public class Category {

    @Id
    private String _id;

    private String name;

    private List<String> urls;

    private String classification;

    public Category(String name, String classification) {
        this.name = name;
        this.classification = classification;
    }

    public Category(String name, List<String> urls, String classification) {
        this.name = name;
        this.urls = urls;
        this.classification = classification;
    }

    public Category(String name) {
        this.name = name;
    }

    public String uniqueAttributes() {
        return _id + urls;
    }
}
