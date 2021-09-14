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
@Document(collection = "classifications")
public class Classification {
    @Id
    private String _id;

    private String name;
    private List<String> categoryNames;
    private List<String> categoryIds;
    private List<String> urls;

    public Classification(String name, List<String> categoryNames) {
        this.name = name;
        this.categoryNames = categoryNames;
    }



    public Classification(String name, List<String> categoryNames, List<String> urls) {
        this.name = name;
        this.categoryNames = categoryNames;
        this.urls = urls;
    }

    public String uniqueAttributes() {
        return _id + categoryIds;
    }

}
