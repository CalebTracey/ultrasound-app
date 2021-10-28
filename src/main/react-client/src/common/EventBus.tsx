/* eslint-disable no-undef */

const on = (
    event: string,
    ac: AbortController,
    callback: { (): void; (arg: Event): void }
): void => {
    document.addEventListener(event, (e) => callback(e), {
        signal: ac.signal,
    })
}
const dispatch = (event: string, data?: any): void => {
    document.dispatchEvent(new CustomEvent(event, { detail: data }))
}
const remove = (
    event: string,
    callback: EventListenerOrEventListenerObject
): void => {
    document.removeEventListener(event, callback)
}

const eventBus = { on, dispatch, remove }
export default eventBus
