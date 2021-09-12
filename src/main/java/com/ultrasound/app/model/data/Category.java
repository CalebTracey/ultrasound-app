package com.ultrasound.app.model.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "categories")
public class Category {

    @Id
    private String id;

    private String name;

    private String fileId;

    private String classification;

    public Category(String name, String classification) {
        this.name = name;
        this.classification = classification;
    }


    public Category(String name) {
        this.name = name;
    }

    public String uniqueAttributes() {
        return id + name;
    }
}
