import { ObjectStorage } from "../ObjectStorage";
import { S3Bucket } from "./crd";

export class S3 implements ObjectStorage {
  async createBucket(strategy: S3Bucket): Promise<void> {
    const bucketName = strategy.spec.name;
    const region = strategy.spec.region;
    console.log(`Creating bucket '${bucketName}' in region '${region}'`);
  }
}
