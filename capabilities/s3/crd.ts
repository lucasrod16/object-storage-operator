import { a } from "pepr";

export class S3Bucket extends a.GenericKind {
  spec: {
    /**
     * The name of the S3 bucket.
     */
    name: string;

    /**
     * The AWS region where the bucket will be created.
     */
    region: string;
  };
}
