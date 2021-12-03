import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../../auth/auth-utils';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { deleteExpense } from '../../helpers/expense-logic';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const expenseId = event.pathParameters.expenseId;
	const userId = getUserId(event);

	await deleteExpense(expenseId, userId);

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
