"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const jewellery_type_service_1 = __importDefault(require("../services/jewellery-type.service"));
const file_service_1 = require("../utils/file-service");
const http_status_1 = require("../utils/http-status");
const getAllJewelleryTypes = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        const types = await jewellery_type_service_1.default.getAllJewelleryTypes(search, status);
        if (!types.length)
            return (0, http_status_1.sendSuccessResponse)(res, 'No jewellery types found.', types);
        (0, http_status_1.sendSuccessResponse)(res, 'Jewellery types fetched successfully.', types);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch jewellery types.', error);
        next(error);
    }
};
const getAllJewelleryTypesPaginated = async (req, res, next) => {
    try {
        const { page, limit, search, status } = req.query;
        const paginated = await jewellery_type_service_1.default.getAllJewelleryTypesPaginated(page, limit, search, status);
        if (!paginated.jewellery_types.length)
            return (0, http_status_1.sendSuccessResponse)(res, 'No jewellery types found.', paginated);
        (0, http_status_1.sendSuccessResponse)(res, 'Jewellery types fetched successfully.', paginated);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch jewellery types.', error);
        next(error);
    }
};
const getJewelleryTypeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const type = await jewellery_type_service_1.default.findJewelleryTypeById(id);
        if (!type)
            return (0, http_status_1.sendNotFoundResponse)(res, 'Jewellery type not found.');
        (0, http_status_1.sendSuccessResponse)(res, 'Jewellery type fetched successfully.', type);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch jewellery type.', error);
        next(error);
    }
};
const createJewelleryType = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { type_name, status } = req.body;
        const nameExists = await jewellery_type_service_1.default.findJewelleryTypeByName(type_name);
        if (nameExists) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/jewellery-types/${req.file.filename}`);
            return (0, http_status_1.sendConflictErrorResponse)(res, 'Jewellery type with this name already exists!');
        }
        const image_url = req.file ? `media/jewellery-types/${req.file.filename}` : null;
        const created = await jewellery_type_service_1.default.createJewelleryType({
            type_name,
            status: status || 'ACTIVE',
            image_url,
        }, transaction);
        if (!created) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/jewellery-types/${req.file.filename}`);
            return (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create jewellery type.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Jewellery type created successfully.', created);
    }
    catch (error) {
        await transaction.rollback();
        if (req.file)
            (0, file_service_1.removeMediaFile)(`media/jewellery-types/${req.file.filename}`);
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create jewellery type.', error);
        next(error);
    }
};
const updateJewelleryType = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { type_name, status } = req.body;
        const existing = await jewellery_type_service_1.default.findJewelleryTypeById(id);
        if (!existing) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/jewellery-types/${req.file.filename}`);
            return (0, http_status_1.sendNotFoundResponse)(res, 'Jewellery type not found.');
        }
        const nameExists = await jewellery_type_service_1.default.findJewelleryTypeByName(type_name, id);
        if (nameExists) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/jewellery-types/${req.file.filename}`);
            return (0, http_status_1.sendConflictErrorResponse)(res, 'Jewellery type with this name already exists!');
        }
        const updateData = {
            type_name,
            status: status || existing.status,
        };
        if (req.file) {
            updateData.image_url = `media/jewellery-types/${req.file.filename}`;
        }
        const updatedRowsCount = await jewellery_type_service_1.default.updateJewelleryType(id, updateData, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/jewellery-types/${req.file.filename}`);
            return (0, http_status_1.sendBadRequestResponse)(res, 'Jewellery type not found or no changes made.');
        }
        if (req.file && existing.image_url) {
            (0, file_service_1.removeMediaFile)(existing.image_url);
        }
        const updated = await jewellery_type_service_1.default.findJewelleryTypeById(id, transaction);
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Jewellery type updated successfully.', updated);
    }
    catch (error) {
        await transaction.rollback();
        if (req.file)
            (0, file_service_1.removeMediaFile)(`media/jewellery-types/${req.file.filename}`);
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update jewellery type.', error);
        next(error);
    }
};
const deleteJewelleryType = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const existing = await jewellery_type_service_1.default.findJewelleryTypeById(id);
        if (!existing) {
            await transaction.rollback();
            return (0, http_status_1.sendNotFoundResponse)(res, 'Jewellery type not found.');
        }
        const updatedRowsCount = await jewellery_type_service_1.default.deleteJewelleryType(id, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Jewellery type not found or already deleted.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Jewellery type deleted successfully.');
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to delete jewellery type.', error);
        next(error);
    }
};
exports.default = {
    getAllJewelleryTypes,
    getAllJewelleryTypesPaginated,
    getJewelleryTypeById,
    createJewelleryType,
    updateJewelleryType,
    deleteJewelleryType,
};
