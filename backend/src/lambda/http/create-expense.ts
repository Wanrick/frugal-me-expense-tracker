import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../../auth/auth-utils';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { CreateExpenseRequest } from '../../requests/create-expense-request';
import { createExpense } from '../../helpers/expense-logic';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const expense: CreateExpenseRequest = JSON.parse(event.body);
	const userId = getUserId(event);
	const newExpense = await createExpense(userId, expense);

	return {
		statusCode: 201,
		body: JSON.stringify({
			newExpense,
		}),
	};
});

handler.use(httpErrorHandler()).use(
	cors({
		credentials: true,
	})
);
