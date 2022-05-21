export declare class TransientObject<TObject extends object> {
    private _isDisposed;
    private _proxy?;
    private _promise;
    private _resolve?;
    private _reject?;
    constructor();
    get isDisposed(): boolean;
    getObject(): Promise<TObject>;
    resolve(obj: TObject): TObject;
    reject(reason?: any): void;
    dispose(): void;
}
//# sourceMappingURL=TransientObject.d.ts.map