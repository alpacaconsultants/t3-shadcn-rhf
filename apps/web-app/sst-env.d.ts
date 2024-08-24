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
    "EmailAlpaca": {
      "sender": string
      "type": "sst.aws.Email"
    }
    "WebApp": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
export {}
