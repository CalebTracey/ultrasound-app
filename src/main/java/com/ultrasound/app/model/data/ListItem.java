package com.ultrasound.app.model.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListItem {
    private String name;
    private String title;
    private String link;
    private EType type = EType.TYPE_ITEM;

    public ListItem(String name, String title, String link) {
        this.name = name;
        this.title = title;
        this.link = link;
    }
}
