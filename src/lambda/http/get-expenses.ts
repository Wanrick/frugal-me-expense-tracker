import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../../auth/auth-utils';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { getExpensesForUser } from '../../helpers/expense-logic';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const userId = getUserId(event);
	const expenses = await getExpensesForUser(userId);

	return expenses && expenses.length > 0
		? {
				statusCode: 200,
				body: JSON.stringify({
					items: expenses,
				}),
		  }
		: {
				statusCode: 204,
				body: JSON.stringify({
					items: null,
				}),
		  };
});

handler.use(httpErrorHandler()).use(
	cors({
		credentials: true,
	})
);
