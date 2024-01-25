import { Capability, RegisterKind } from "pepr";
import { S3Bucket } from "./s3/crd";
import { S3 } from "./s3/storage";

export const ObjectStorageOperator = new Capability({
  name: "object-storage-operator",
  description: "A Kubernetes Operator for managing object storage buckets.",
  namespaces: ["storage"],
});

const { When } = ObjectStorageOperator;

RegisterKind(S3Bucket, {
  group: "dashdays.dev",
  version: "v1",
  kind: "S3Bucket",
});

When(S3Bucket)
  .IsCreatedOrUpdated()
  .InNamespace("storage")
  .Watch(async () => {
    const s3 = new S3();
    await s3.createBucket(S3Bucket);
  });
