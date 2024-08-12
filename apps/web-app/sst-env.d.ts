/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "SurveyBucket": {
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
