import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

export class FileBucketUtils {
	private s3: AWS.S3;
	private readonly bucketName: string;

	constructor() {
		const xaws = AWSXRay.captureAWS(AWS);
		this.s3 = new xaws.S3({
			signatureVersion: 'v4',
		});
		this.bucketName = process.env.FM_S3_BUCKET;
	}

	public getUploadUrl(bucketKey: string): string {
		const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

		return this.s3.getSignedUrl('putObject', {
			Bucket: this.bucketName,
			Key: bucketKey,
			Expires: urlExpiration
		});
	}

	public getDownloadUrl(bucketKey: string): string {
		const urlExpiration = parseInt(process.env.SIGNED_URL_DOWNLOAD_EXPIRATION);

		return this.s3.getSignedUrl('getObject', {
			Bucket: this.bucketName,
			Key: bucketKey,
			Expires: urlExpiration
		});
	}
}
