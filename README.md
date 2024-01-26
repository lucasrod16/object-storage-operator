# Object Storage Operator

A Kubernetes Operator for managing object storage buckets.

⚠️ This is an experiment for Dash Days.

The goal is to allow users to manage object storage buckets across different providers without having to write complex Infrastructure as Code for each provider. Each provider has its own Kubernetes [CustomResource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) that can be used to manage buckets. Here is an example of a CustomResource used to create a S3 bucket in AWS:

```yaml
apiVersion: dashdays.dev/v1
kind: S3Bucket
metadata:
  name: loki
spec:
  name: loki
  region: us-west-2
```

The providers being targeted for this experiment are [AWS S3](https://aws.amazon.com/s3/) and [Rook](https://github.com/rook/rook).

## Usage

Install Dependencies (if necessary)

- [Node.js version >=18.0.0](https://nodejs.org/en/download)
- [Zarf CLI](https://docs.zarf.dev/docs/getting-started/installing-zarf)

Clone the repo

```bash
git clone https://github.com/lucasrod16/object-storage-operator.git
```

Once changed into the root directory of the repo, install node dependencies

```bash
npm ci
```

### Manage S3 Buckets in AWS

To manage S3 buckets in AWS with the operator, you must provide an IAM role ARN to be used for [IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) authentication.

While you can use any Kubernetes cluster configured with IRSA, this guide will walk through the steps to setup an environment using the scripts provided in the `package.json` in this repo.

The following dependencies are required to use the provided scripts:

- AWS account with permissions to create an EKS cluster and IAM roles and policies
- bash
- [eksctl](https://eksctl.io/installation/)
- [jq](https://jqlang.github.io/jq/download/)
- [aws cli v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Create an EKS cluster and IAM resources

*Note*: It takes awhile for the EKS cluster to create (typically 15+ minutes)

```bash
npm run standup:all
```

*Note*: Copy the IAM role ARN from the output of the previous command. You will need this when deploying the operator.

```bash
"IAM role ARN: <your_role_arn>"
```

Deploy the operator

```bash
zarf dev deploy --deploy-set="S3_ROLE_ARN=<your_role_arn>"
```

Create a S3 bucket in AWS

```bash
zarf tools kubectl apply -f manifests/s3.yaml
```

Verify the bucket was created in AWS

```bash
aws s3 ls | grep loki
```

`loki-98294530` *should be* in the output

`98294530` are the first 8 characters of the SHA-256 hash of the provided bucket name, in this case "loki". This is appended to the end of the provided bucket name in the S3Bucket manifests' `spec.name` to help prevent naming collisions in AWS.

View the S3Bucket custom resource in the cluster

```bash
zarf tools kubectl get s3bucket loki -o yaml
```

To delete the S3 bucket in AWS, simply delete the S3Bucket resource from the cluster

```bash
zarf tools kubectl delete s3bucket loki
```

Verify the bucket was deleted in AWS

```bash
aws s3 ls | grep loki
```

`loki-98294530` should *not* show up in the output
