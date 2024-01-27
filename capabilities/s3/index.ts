import { Capability } from "pepr";
import { S3Bucket } from "./s3bucket-v1";
import { S3 } from "./bucket";

export const awsS3 = new Capability({
  name: "aws-s3",
  description: "Manages object storage buckets in AWS S3.",
  namespaces: ["default"],
});

const { When } = awsS3;

When(S3Bucket)
  .IsCreated()
  .InNamespace("default")
  .Watch(async bucket => {
    const s3 = new S3(bucket.spec.region);
    await s3.createBucket(bucket);
  });

When(S3Bucket)
  .IsDeleted()
  .InNamespace("default")
  .Watch(async bucket => {
    const s3 = new S3(bucket.spec.region);
    await s3.deleteBucket(bucket);
  });
