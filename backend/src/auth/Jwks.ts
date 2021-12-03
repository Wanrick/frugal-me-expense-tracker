/**
 * Interface representing a JSON Web Key object
 */
interface Jwk {
	alg: string;
	kty: string;
	use: string;
	n: string;
	e: string;
	kid: string;
	x5t: string;
	x5c: string[];
}

/**
 * Interface representing an object containing a JSON Web Key Array
 */
export interface Jwks {
	keys: Jwk[];
}
