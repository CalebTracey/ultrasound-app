/**
 * * Data models
 */
export interface IListItem {
    name: string
    title: string
    link: string
    type: string
}
export interface ISubMenu {
    [key: string]: string
}
export interface ISubMenuObj {
    _id: string
    name: string
    itemList: IListItem[]
    type: string
}
export interface IClassification {
    _id: string
    name: string
    hasSubMenu: boolean
    listItems: IListItem[]
    subMenus: ISubMenu[]
    type: string
}
/**
 * Auth
 */
export interface IAppUser {
    accessToken: string
    email: string
    id: string
    roles: string[]
    tokenType: string
}
export interface IUserLogin {
    username: string
    password: string
}
/**
 * * Errors
 */
export interface SerializedError {
    name?: string
    message?: string
    stack?: string
    code?: string
}
