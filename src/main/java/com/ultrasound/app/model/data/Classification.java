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
    private String id;

    private String name;


    private List<String> categoryNames;

    private List<String> categoryIds;

    public Classification(String name, List<String> categoryNames) {
        this.name = name;
        this.categoryNames = categoryNames;
    }



    public Classification(String name, List<String> categoryNames, List<String> categoryIds) {
        this.name = name;
        this.categoryNames = categoryNames;
        this.categoryIds = categoryIds;
    }

    public String uniqueAttributes() {
        return id + name + categoryNames;
    }

}
