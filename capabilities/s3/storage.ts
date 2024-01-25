import { ObjectStorage } from "../ObjectStorage";
import { a } from "pepr";
import { S3Bucket } from "./crd";

export class S3 implements ObjectStorage {
  async createBucket(strategy: a.GenericKind): Promise<void> {
    if (strategy instanceof S3Bucket) {
      const bucketName = strategy.spec.name;
      const region = strategy.spec.region;
      console.log(`Creating bucket '${bucketName}' in region '${region}'`);
    } else {
      throw new Error("Unsupported strategy type. Must use S3Bucket strategy.");
    }
  }
}
