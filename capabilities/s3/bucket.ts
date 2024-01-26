import {
  S3Client,
  CreateBucketCommand,
  CreateBucketCommandInput,
  DeleteBucketCommand,
  DeleteBucketCommandInput,
} from "@aws-sdk/client-s3";
import { ObjectStorage } from "../ObjectStorage";
import { S3Bucket } from "./crd";
import { generateHash } from "../lib/utils";
import { Log } from "pepr";

export class S3 implements ObjectStorage {
  private client: S3Client;

  constructor(region: string) {
    this.client = new S3Client({ region: region });
  }

  async createBucket(strategy: S3Bucket): Promise<void> {
    const hash = generateHash(strategy.spec.name);
    const bucketName = `${strategy.spec.name}-${hash}`;
    const region = strategy.spec.region;

    const input: CreateBucketCommandInput = {
      Bucket: bucketName,
    };

    try {
      const createBucketCommand = new CreateBucketCommand(input);
      await this.client.send(createBucketCommand);
      Log.info(
        `Bucket '${bucketName}' created successfully in region ${region}.`,
      );
    } catch (err) {
      Log.error(`Error creating bucket: ${err}`);
    }
  }

  async deleteBucket(strategy: S3Bucket): Promise<void> {
    const hash = generateHash(strategy.spec.name);
    const bucketName = `${strategy.spec.name}-${hash}`;
    const region = strategy.spec.region;

    const input: DeleteBucketCommandInput = {
      Bucket: bucketName,
    };

    try {
      const deleteBucketCommand = new DeleteBucketCommand(input);
      await this.client.send(deleteBucketCommand);
      Log.info(
        `Bucket '${bucketName}' deleted successfully in region ${region}.`,
      );
    } catch (err) {
      Log.error(`Error deleting bucket: ${err}`);
    }
  }
}
