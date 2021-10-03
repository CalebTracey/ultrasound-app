package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.ItemNotFoundException;
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
    public String deleteItem(Classification classification, String title, String name) {
//        Classification classification = classificationService.getById(classificationId);
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
    public String deleteItem(SubMenu subMenu, String title, String name) {
//        SubMenu subMenu = subMenuService.getById(subMenuId);
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

    @Override
    public ListItem findByLink(List<ListItem> listItems, String link, String name, String parentType, String parentName) {
        Predicate<ListItem> linkFilter = ListItem -> ListItem.getLink().equals(link);
        return listItems.stream().filter(linkFilter).findAny()
                .orElseThrow(() -> new ItemNotFoundException(name, parentType, parentName));
    }

    @Override
    public List<ListItem> removeItemFromList(List<ListItem> listItems, String link) {
        Predicate<ListItem> linkFilter = ListItem -> ListItem.getLink().equals(link);
        return listItems.stream().filter(Predicate.not(linkFilter))
                .collect(Collectors.toList());
    }

    @Override
    public ListItem editTitle(ListItem item, String classificationName, String subMenuName, String newName) {
        return null;
    }

    @Override
    public ListItem editTitle(ListItem item, String classificationName, String newName) {
        return null;
    }
}
