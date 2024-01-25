import { a } from "pepr";

/**
 * ObjectStorage is an interface for managing object storage buckets.
 */
export interface ObjectStorage {
  /**
   * Creates a new storage bucket.
   */
  createBucket(strategy: a.GenericKind): Promise<void>;
}
