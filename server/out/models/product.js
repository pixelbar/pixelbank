"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mikro_orm_1 = require("mikro-orm");
let Product = class Product {
    constructor(code, name, price) {
        this.code = code;
        this.name = name;
        this.price = price;
    }
};
__decorate([
    mikro_orm_1.PrimaryKey()
], Product.prototype, "id", void 0);
__decorate([
    mikro_orm_1.Property()
], Product.prototype, "name", void 0);
__decorate([
    mikro_orm_1.Property()
], Product.prototype, "code", void 0);
__decorate([
    mikro_orm_1.Property()
], Product.prototype, "price", void 0);
Product = __decorate([
    mikro_orm_1.Entity()
], Product);
exports.Product = Product;
