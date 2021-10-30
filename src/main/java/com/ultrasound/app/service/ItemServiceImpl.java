package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.ItemNotFoundException;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.ListItem;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.payload.response.MessageResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
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
    public MessageResponse deleteItem(
            @NotNull Classification classification, String title, String name, String parentId) {
        String className = classification.getName();
        List<ListItem> itemList = classification.getListItems();
        Predicate<ListItem> keyFilter = ListItem -> ListItem.getName().equals(name);
        Predicate<ListItem> titleFilter = ListItem -> ListItem.getTitle().equals(title);
        log.info("Deleting {} from {}", name, className);
        List<ListItem> listItems = itemList.stream().filter(Predicate.not(keyFilter)
                .and(Predicate.not(titleFilter))).collect(Collectors.toList());
        classification.setListItems(listItems);
        classificationService.save(classification);
        return new MessageResponse("Removed " + name + " from " + className + " and the database");
    }

    @Override
    public MessageResponse deleteItem(
            @NotNull SubMenu subMenu, String title, String name, String parentId) {
        String subName = subMenu.getName();
        List<ListItem> itemList = subMenu.getItemList();
        Predicate<ListItem> keyFilter = ListItem -> ListItem.getName().equals(name);
        Predicate<ListItem> titleFilter = ListItem -> ListItem.getTitle().equals(title);
        log.info("Deleting {} from {}", name, subName);
        List<ListItem> listItems = itemList.stream().filter(Predicate.not(keyFilter)
                .and(Predicate.not(titleFilter))).collect(Collectors.toList());
        if (listItems.size() == 0) {
            subMenuService.deleteById(subMenu.get_id());
            return new MessageResponse("Removed " + subName + "  from the database because no other scans");

        } else {
            subMenu.setItemList(listItems);
            subMenuService.save(subMenu);
            return new MessageResponse("Removed " + name + "  from " + subName);
        }
    }

    @Override
    public ListItem findByLink(@NotNull List<ListItem> listItems, String link, String name, String parentType, String parentName) {
        Predicate<ListItem> linkFilter = ListItem -> ListItem.getLink().equals(link);
        return listItems.stream().filter(linkFilter).findAny()
                .orElseThrow(() -> new ItemNotFoundException(name, parentType, parentName));
    }

    @Override
    public List<ListItem> removeItemFromList(@NotNull List<ListItem> listItems, String link) {
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
