/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "BucketSurveyEnriched": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "BucketSurveyUploads": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "WebApp": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
export {}
