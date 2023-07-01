"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.userSearchableFields = exports.role = void 0;
exports.role = ['seller', 'buyer'];
exports.userSearchableFields = [
    'phoneNumber',
    'role',
    'name.firstName',
    'name.LastName',
];
exports.userFilterableFields = ['searchTerm', 'role', 'phoneNumber'];
