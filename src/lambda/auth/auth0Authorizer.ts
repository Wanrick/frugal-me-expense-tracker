import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import 'source-map-support/register';

import { decode, verify } from 'jsonwebtoken';
import { createLogger } from '../../utils/logger';
import Axios from 'axios';
import { Jwt } from '../../auth/Jwt';
import { JwtPayload } from '../../auth/JwtPayload';
import { Jwks } from '../../auth/Jwks';
import { Unauthorized } from 'http-errors';

const logger = createLogger('AUTH');
const jsonWebKeySetUrl = 'https://wanrick-pro.eu.auth0.com/.well-known/jwks.json';

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
	logger.info('Authorizing calling user', event.authorizationToken);
	try {
		const jwtToken = await verifyToken(event.authorizationToken);
		logger.info('User was authorized', jwtToken);

		return {
			principalId: jwtToken.sub,
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: 'Allow',
						Resource: '*',
					},
				],
			},
		};
	} catch (e) {
		logger.error('User not authorized', { error: e.message });

		return {
			principalId: 'user',
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: 'Deny',
						Resource: '*',
					},
				],
			},
		};
	}
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
	const token = getToken(authHeader);
	const jwt: Jwt = decode(token, { complete: true }) as Jwt;
	const header = jwt.header;

	if (!header || header.alg !== 'RS256') {
		throw new Unauthorized('User not authorized');
	}

	const signingKey = await getSigningKey(header.kid);
	return verify(token, signingKey.publicKey, { algorithms: ['RS256'] }) as JwtPayload;
}

function getToken(authHeader: string): string {
	if (!authHeader) {
		logger.error('No authentication header');
		throw new Error('No authentication header');
	}

	if (!authHeader.toLowerCase().startsWith('bearer ')) {
		logger.error('Invalid authentication header');
		throw new Error('Invalid authentication header');
	}

	return authHeader.split(' ')[1];
}

async function getJSONWebKeySet(): Promise<Jwks> {
	try {
		const response = await Axios.get(jsonWebKeySetUrl);
		return response.data;
	} catch (error) {
		logger.error('Error getting JWKS', { error: error.message });
		throw new Error('Error getting JWKS');
	}
}

function filterJSONWebKeySet(jwks: Jwks): { kid: string; publicKey: any } {
	if (!jwks || !jwks.keys || !jwks.keys.length) {
		logger.error('The JWKS endpoint did not contain any keys');
		throw new Error('Error getting Keys from Jwks');
	}

	const signingKeys = jwks.keys
		.filter(
			(key) => key.use === 'sig' && key.kty === 'RSA' && key.kid && ((key.x5c && key.x5c.length) || (key.n && key.e))
		)
		.map((key) => {
			return { kid: key.kid, publicKey: certToPEM(key.x5c[0]) };
		});

	if (!signingKeys.length) {
		logger.error('The JWKS endpoint did not contain any signature verification keys');
		throw new Error('Error getting Keys from Jwks');
	}

	return signingKeys[0];
}

async function getSigningKey(kid) {
	const signingKey = filterJSONWebKeySet(await getJSONWebKeySet());

	if (!signingKey) {
		logger.error(`Unable to find a signing key that matches '${kid}'`);
		throw new Unauthorized('User not authorized');
	}

	return signingKey;
}

function certToPEM(cert) {
	cert = cert.match(/.{1,64}/g).join('\n');
	cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
	return cert;
}
