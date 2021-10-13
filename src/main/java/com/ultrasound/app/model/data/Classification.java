package com.ultrasound.app.model.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "classifications")
public class Classification {
    @Id
    private String _id;

    private String name;
    private Boolean hasSubMenu;
    private List<ListItem> listItems;
    private Map<String, String> subMenus;
    private EType type = EType.TYPE_CLASSIFICATION;

    public Classification(String name, Boolean hasSubMenu, List<ListItem> listItems, Map<String, String> subMenus) {
        this.name = name;
        this.hasSubMenu = hasSubMenu;
        this.listItems = listItems;
        this.subMenus = subMenus;
    }
}
