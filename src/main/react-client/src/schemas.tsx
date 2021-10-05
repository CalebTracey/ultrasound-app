export interface IListItem {
    name: string
    title: string
    link: string
}
export interface ISubMenu {
    [key: string]: string
}
export interface ISubMenuObj {
    _id: string
    name: string
    itemList: IListItem[]
}
export interface IClassification {
    _id: string
    name: string
    hasSubMenu: boolean
    listItems: IListItem[]
    subMenus: ISubMenu[]
}
