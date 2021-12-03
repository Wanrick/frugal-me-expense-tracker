import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
import { Expense } from '../models/expense';
import { UpdateExpenseRequest } from '../requests/update-expense-request';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('ExpenseRepository');

export class ExpenseRepository {
	private documentClient: AWS.DynamoDB.DocumentClient;

	constructor() {
		this.documentClient = new XAWS.DynamoDB.DocumentClient();
	}

	public async createExpense(expense: Expense): Promise<Expense> {
		logger.info('Creating expense', { expense });
		await this.documentClient
			.put({
				TableName: process.env.EXPENSES_DYNAMODB_TABLE,
				Item: expense,
			})
			.promise();
		return expense;
	}

	public async getAllExpenses(userId: string): Promise<Expense[]> {
		logger.info("Getting all user's expenses", { userId });
		const result = await this.documentClient
			.query({
				TableName: process.env.EXPENSES_DYNAMODB_TABLE,
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					':userId': userId,
				},
			})
			.promise();

		const items = result.Items;
		return items as Expense[];
	}

	public async updateExpense(userId: string, expenseId: string, updatedExpense: UpdateExpenseRequest): Promise<void> {
		logger.info('Updating expense', { userId, expenseId, updatedExpense });
		await this.documentClient
			.update({
				TableName: process.env.EXPENSES_DYNAMODB_TABLE,
				Key: {
					userId: userId,
					expenseId: expenseId,
				},
				UpdateExpression: 'set #category = :category, #amount = :amount',
				ExpressionAttributeNames: {
					'#category': 'category',
					'#amount': 'amount',
				},
				ExpressionAttributeValues: {
					':category': updatedExpense.category,
					':amount': updatedExpense.amount,
				},
			})
			.promise();
	}

	public async deleteExpense(userId: string, expenseId: string): Promise<void> {
		logger.info('Deleting expense', { userId, expenseId });
		await this.documentClient
			.delete({
				TableName: process.env.EXPENSES_DYNAMODB_TABLE,
				Key: {
					userId: userId,
					expenseId: expenseId,
				},
			})
			.promise();
	}

	public async setInvoiceUrl(userId: string, expenseId: string, invoiceUrl: string): Promise<void> {
		logger.info('Updating expense invoice file', { userId, expenseId, invoiceUrl });
		await this.documentClient
			.update({
				TableName: process.env.EXPENSES_DYNAMODB_TABLE,
				Key: {
					userId: userId,
					expenseId: expenseId,
				},
				UpdateExpression: 'set #invoiceUrl = :invoiceUrl',
				ExpressionAttributeNames: {
					'#invoiceUrl': 'invoiceUrl',
				},
				ExpressionAttributeValues: {
					':invoiceUrl': invoiceUrl,
				},
			})
			.promise();
	}
}
