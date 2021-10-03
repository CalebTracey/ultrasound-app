package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.ListItem;
import com.ultrasound.app.model.data.SubMenu;

import java.util.List;

public interface ItemService {
    String deleteItem(Classification classification, String title, String name);
    String deleteItem(SubMenu subMenu, String title, String name);
    ListItem findByLink(List<ListItem> listItems, String link, String name, String subName, String parentType);
    List<ListItem> removeItemFromList(List<ListItem> listItems, String link);
    ListItem editTitle(ListItem item, String classificationName, String subMenuName, String newName);
    ListItem editTitle(ListItem item, String classificationName, String newName);

}
