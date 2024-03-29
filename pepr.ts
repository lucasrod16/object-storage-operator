import { PeprModule } from "pepr";
import cfg from "./package.json";
import { awsS3 } from "./capabilities/s3";

/**
 * This is the main entrypoint for this Pepr module. It is run when the module is started.
 * This is where you register your Pepr configurations and capabilities.
 */
new PeprModule(cfg, [awsS3]);
