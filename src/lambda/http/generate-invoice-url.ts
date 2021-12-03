import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../../auth/auth-utils';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { createPresignedUrl } from '../../helpers/expense-logic';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const expenseId = event.pathParameters.expenseId;
	const userId = getUserId(event);

	const url = await createPresignedUrl(userId, expenseId);

	return {
		statusCode: 200,
		body: JSON.stringify({
			uploadUrl: url,
		}),
	};
});

handler.use(httpErrorHandler()).use(
	cors({
		credentials: true,
	})
);
