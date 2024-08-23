/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "BucketSurveyProcessed": {
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
