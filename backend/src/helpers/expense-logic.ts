import { ExpenseRepository } from './expense-repository';
import { FileBucketUtils } from './file-bucket-utils';
import { createLogger } from '../utils/logger';
import * as uuid from 'uuid';
import * as createError from 'http-errors';
import { CreateExpenseRequest } from '../requests/create-expense-request';
import { UpdateExpenseRequest } from '../requests/update-expense-request';
import { Expense } from '../models/expense';

const logger = createLogger('ExpenseLogic');
const _expenseRepository = new ExpenseRepository();
const _bucketUtils = new FileBucketUtils();
const defaultCurrency = 'EUR';

export async function createExpense(userId: string, newExpense: CreateExpenseRequest): Promise<Expense> {
	logger.debug('Creating Expense');

	const itemId = uuid.v4();

	const newItem = {
		userId: userId,
		expenseId: itemId,
		createdAt: Date(),
		description: newExpense.description,
		category: newExpense.category,
		amount: newExpense.amount,
		currency: defaultCurrency,
		invoiceUrl: "/"
	};

	const savedItem = await _expenseRepository.createExpense(newItem);
	if (savedItem) {
		return savedItem;
	} else {
		logger.error('Could not create new expense', {
			userId: userId,
			newExpense: newExpense,
		});
		throw new createError.InternalServerError('Error creating expense');
	}
}

export async function getExpensesForUser(userId: string): Promise<Expense[]> {
	logger.info('Getting expenses');
	return await _expenseRepository.getAllExpenses(userId);
}

export async function updateExpense(
	userId: string,
	expenseId: string,
	updatedExpense: UpdateExpenseRequest
): Promise<void> {
	logger.info('Updating expense');
	return await _expenseRepository.updateExpense(userId, expenseId, updatedExpense);
}

export async function deleteExpense(expenseId: string, userId: string): Promise<void> {
	logger.info('Deleting expense');
	return await _expenseRepository.deleteExpense(expenseId, userId);
}

export async function createPresignedUrl(userId: string, expenseId: string): Promise<string> {
	logger.info('Getting upload url');
	const uId = userId.split('|')[1];
	const bucketKey = `UU${uId}UUTT${expenseId}TT`;

	const uploadUrl = _bucketUtils.getUploadUrl(bucketKey);
	const invoiceUrl = _bucketUtils.getDownloadUrl(bucketKey);
	await _expenseRepository.setInvoiceUrl(userId, expenseId, invoiceUrl);
	return uploadUrl;
}
