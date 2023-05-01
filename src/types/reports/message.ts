export interface Message {
    content: string,
    links: {
        [name: string]: string
    },
}
