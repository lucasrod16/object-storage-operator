import { Capability, RegisterKind, K8s } from "pepr";
import { S3Bucket } from "./s3/crd";
import { S3 } from "./s3/bucket";

const s3BucketNameAnnotation = "dashdays.dev/s3bucket-name";
const s3BucketRegionAnnotation = "dashdays.dev/s3bucket-region";

export const ObjectStorageOperator = new Capability({
  name: "object-storage-operator",
  description: "A Kubernetes Operator for managing object storage buckets.",
  namespaces: ["default"],
});

const { When } = ObjectStorageOperator;

RegisterKind(S3Bucket, {
  group: "dashdays.dev",
  version: "v1",
  kind: "S3Bucket",
});

When(S3Bucket)
  .IsCreated()
  .InNamespace("default")
  .Mutate(async request => {
    request.SetAnnotation(s3BucketNameAnnotation, request.Raw.spec.name);
    request.SetAnnotation(s3BucketRegionAnnotation, request.Raw.spec.region);
  })
  .Watch(async bucket => {
    const s3 = new S3(bucket.spec.region);
    await s3.createBucket(bucket);
  });

When(S3Bucket)
  .IsUpdated()
  .InNamespace("default")
  .Validate(async request => {
    const bucket = await K8s(S3Bucket).Get(request.Raw.metadata.name);

    const bucketNameAnnotation =
      bucket.metadata.annotations[s3BucketNameAnnotation];

    const bucketRegionAnnotation =
      bucket.metadata.annotations[s3BucketRegionAnnotation];

    if (request.Raw.spec.name !== bucketNameAnnotation) {
      return request.Deny(
        "The '.spec.name' field in a S3Bucket resource is immutable.",
      );
    }

    if (request.Raw.spec.region !== bucketRegionAnnotation) {
      return request.Deny(
        "The '.spec.region' field in a S3Bucket resource is immutable.",
      );
    }
  });

When(S3Bucket)
  .IsDeleted()
  .InNamespace("default")
  .Watch(async bucket => {
    const s3 = new S3(bucket.spec.region);
    await s3.deleteBucket(bucket);
  });
