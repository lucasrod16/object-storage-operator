# Object Storage Operator

A Kubernetes Operator for managing object storage buckets.

⚠️ This is an experiment for Dash Days.

The goal is to allow users to manage object storage buckets across different providers without having to write complex Infrastructure as Code for each provider. Each provider has its own Kubernetes [CustomResource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) that can be used to manage buckets. Here is an example of a CustomResource used to create a S3 bucket in AWS:

```yaml
apiVersion: dashdays.dev/v1
kind: S3Bucket
metadata:
  name: loki
  namespace: storage
spec:
  name: loki
  region: us-west-2
```

The providers being targeted for this experiment are [AWS S3](https://aws.amazon.com/s3/) and [Rook](https://github.com/rook/rook).

## Usage

TBD
