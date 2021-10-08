/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const eventBus = {
    on(event: string, callback: { (): void; (arg0: Event): void }) {
        document.addEventListener(event, (e) => callback(e))
    },
    dispatch(event: string, data?: any) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }))
    },
    remove(event: string, callback: EventListenerOrEventListenerObject) {
        document.removeEventListener(event, callback)
    },
}

export default eventBus
