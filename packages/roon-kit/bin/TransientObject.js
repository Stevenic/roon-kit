"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransientObject = void 0;
class TransientObject {
    constructor() {
        this._isDisposed = false;
        this._promise = new Promise((resolve, reject) => {
            this._resolve = (obj) => __awaiter(this, void 0, void 0, function* () {
                this._proxy = Proxy.revocable(obj, {});
                if (this._isDisposed) {
                    this._proxy.revoke();
                }
                resolve(this._proxy.proxy);
            });
            this._reject = reject;
        });
    }
    get isDisposed() {
        return this._isDisposed;
    }
    getObject() {
        return this._promise;
    }
    resolve(obj) {
        this._resolve(obj);
        return this._proxy.proxy;
    }
    reject(reason) {
        this._reject(reason);
    }
    dispose() {
        var _a;
        if (!this._isDisposed) {
            this._isDisposed = true;
            (_a = this._proxy) === null || _a === void 0 ? void 0 : _a.revoke();
        }
    }
}
exports.TransientObject = TransientObject;
//# sourceMappingURL=TransientObject.js.map