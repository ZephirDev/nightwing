export interface ServiceInterface {
    init?(): Promise<void>;
    destroy?(): Promise<void>;
}