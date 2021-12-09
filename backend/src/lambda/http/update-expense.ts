import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../../auth/auth-utils';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { updateExpense } from '../../helpers/expense-logic';
import { UpdateExpenseRequest } from '../../requests/update-expense-request';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const updatedExpense: UpdateExpenseRequest = JSON.parse(event.body);
	const expenseId = event.pathParameters.expenseId;
	const userId = getUserId(event);

	await updateExpense(userId, expenseId, updatedExpense);

	return {
		statusCode: 202,
		body: '',
	};
});

handler.use(httpErrorHandler()).use(
	cors({
		credentials: true,
	})
);