package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.ListItem;
import com.ultrasound.app.model.data.SubMenu;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ItemServiceImpl implements ItemService{

    @Autowired
    private ClassificationServiceImpl classificationService;
    @Autowired
    private SubMenuServiceImpl subMenuService;

    @Override
    public String deleteItemClassification(String classificationId, String title, String name) {
        Classification classification = classificationService.getById(classificationId);
        String className = classification.getName();
        List<ListItem> itemList = classification.getListItems();
        Predicate<ListItem> keyFilter = ListItem -> ListItem.getName().equals(name);
        Predicate<ListItem> titleFilter = ListItem -> ListItem.getTitle().equals(title);
        log.info("Deleting {} from {}", name, className);
        List<ListItem> listItems = itemList.stream().filter(Predicate.not(keyFilter)
                .and(Predicate.not(titleFilter))).collect(Collectors.toList());
        int count = itemList.size() - listItems.size();
        classification.setListItems(listItems);
        classificationService.save(classification);
        return "Removed " + count + " items from " + className;
    }

    @Override
    public String deleteItemSubMenu(String subMenuId, String title, String name) {
        SubMenu subMenu = subMenuService.getById(subMenuId);
        String subName = subMenu.getName();
        List<ListItem> itemList = subMenu.getItemList();
        Predicate<ListItem> keyFilter = ListItem -> ListItem.getName().equals(name);
        Predicate<ListItem> titleFilter = ListItem -> ListItem.getTitle().equals(title);
        log.info("Deleting {} from {}", name, subName);
        List<ListItem> listItems = itemList.stream().filter(Predicate.not(keyFilter)
                .and(Predicate.not(titleFilter))).collect(Collectors.toList());
        int count = itemList.size() - listItems.size();
        subMenu.setItemList(listItems);
        subMenuService.save(subMenu);
        return "Removed " + count + " items from " + subName;
    }
}
