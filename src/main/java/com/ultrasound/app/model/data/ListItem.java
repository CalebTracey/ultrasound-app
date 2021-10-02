package com.ultrasound.app.model.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListItem {
    private String name;
    private String title;
    private String link;

}
