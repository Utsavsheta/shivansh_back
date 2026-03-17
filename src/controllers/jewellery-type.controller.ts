import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { sequelize } from '../server';
import jewelleryTypeService from '../services/jewellery-type.service';
import { removeMediaFile } from '../utils/file-service';
import { sendBadRequestResponse, sendConflictErrorResponse, sendNotFoundResponse, sendSuccessResponse } from '../utils/http-status';

const getAllJewelleryTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, status } = req.query;
        const types = await jewelleryTypeService.getAllJewelleryTypes(search as string, status as string);
        if (!types.length) return sendSuccessResponse(res, 'No jewellery types found.', types);
        sendSuccessResponse(res, 'Jewellery types fetched successfully.', types);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch jewellery types.', error);
        next(error);
    }
};

const getAllJewelleryTypesPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, search, status } = req.query;
        const paginated = await jewelleryTypeService.getAllJewelleryTypesPaginated(page as unknown as number, limit as unknown as number, search as string, status as string);
        if (!paginated.jewellery_types.length) return sendSuccessResponse(res, 'No jewellery types found.', paginated);
        sendSuccessResponse(res, 'Jewellery types fetched successfully.', paginated);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch jewellery types.', error);
        next(error);
    }
};

const getJewelleryTypeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const type = await jewelleryTypeService.findJewelleryTypeById(id as string);
        if (!type) return sendNotFoundResponse(res, 'Jewellery type not found.');
        sendSuccessResponse(res, 'Jewellery type fetched successfully.', type);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch jewellery type.', error);
        next(error);
    }
};

const createJewelleryType = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { type_name, status } = req.body;

        const nameExists = await jewelleryTypeService.findJewelleryTypeByName(type_name as string);
        if (nameExists) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/jewellery-types/${req.file.filename}`);
            return sendConflictErrorResponse(res, 'Jewellery type with this name already exists!');
        }

        const image_url = req.file ? `media/jewellery-types/${req.file.filename}` : null;

        const created = await jewelleryTypeService.createJewelleryType({
            type_name,
            status: status || 'ACTIVE',
            image_url,
        }, transaction);

        if (!created) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/jewellery-types/${req.file.filename}`);
            return sendBadRequestResponse(res, 'Failed to create jewellery type.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'Jewellery type created successfully.', created);
    } catch (error) {
        await transaction.rollback();
        if (req.file) removeMediaFile(`media/jewellery-types/${req.file.filename}`);
        sendBadRequestResponse(res, 'Failed to create jewellery type.', error);
        next(error);
    }
};

const updateJewelleryType = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { type_name, status } = req.body;

        const existing = await jewelleryTypeService.findJewelleryTypeById(id as string);
        if (!existing) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/jewellery-types/${req.file.filename}`);
            return sendNotFoundResponse(res, 'Jewellery type not found.');
        }

        const nameExists = await jewelleryTypeService.findJewelleryTypeByName(type_name as string, id as string);
        if (nameExists) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/jewellery-types/${req.file.filename}`);
            return sendConflictErrorResponse(res, 'Jewellery type with this name already exists!');
        }

        const updateData: any = {
            type_name,
            status: status || existing.status,
        };

        if (req.file) {
            updateData.image_url = `media/jewellery-types/${req.file.filename}`;
        }

        const updatedRowsCount = await jewelleryTypeService.updateJewelleryType(id as string, updateData, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/jewellery-types/${req.file.filename}`);
            return sendBadRequestResponse(res, 'Jewellery type not found or no changes made.');
        }

        if (req.file && (existing as any).image_url) {
            removeMediaFile((existing as any).image_url);
        }

        const updated = await jewelleryTypeService.findJewelleryTypeById(id as string, transaction);
        await transaction.commit();
        sendSuccessResponse(res, 'Jewellery type updated successfully.', updated);
    } catch (error) {
        await transaction.rollback();
        if (req.file) removeMediaFile(`media/jewellery-types/${req.file.filename}`);
        sendBadRequestResponse(res, 'Failed to update jewellery type.', error);
        next(error);
    }
};

const deleteJewelleryType = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const existing = await jewelleryTypeService.findJewelleryTypeById(id as string);
        if (!existing) {
            await transaction.rollback();
            return sendNotFoundResponse(res, 'Jewellery type not found.');
        }

        const updatedRowsCount = await jewelleryTypeService.deleteJewelleryType(id as string, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Jewellery type not found or already deleted.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'Jewellery type deleted successfully.');
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to delete jewellery type.', error);
        next(error);
    }
};

export default {
    getAllJewelleryTypes,
    getAllJewelleryTypesPaginated,
    getJewelleryTypeById,
    createJewelleryType,
    updateJewelleryType,
    deleteJewelleryType,
};

