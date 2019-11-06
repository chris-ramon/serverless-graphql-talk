#### Environment Variables
```
export AWS_NAMESPACE=starwars
export AWS_PROFILE=YOUR_AWS_PROFILE
export AWS_APPSYNC_URL=https://FAKE_AWS_APPSYNC_URL.appsync-api.us-east-1.amazonaws.com/graphql
```

#### Deploy AWS Lambda's S3


```
aws cloudformation deploy \
  --template-file lambda-s3.yaml \
  --stack-name "${AWS_NAMESPACE}-subscriptions-lambda-s3" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides AwsNamespace="${AWS_NAMESPACE}"
```

#### Package AWS Lambda
```
aws cloudformation package \
    --template-file template.yaml \
    --s3-bucket "${AWS_NAMESPACE}-lambda-60b77a97-ed05-45e2-a19f-2f0d1ec7dd63" \
    --output-template-file packaged-template.yaml
```

#### Deploy AWS Lambda
```
aws cloudformation deploy \
    --template-file packaged-template.yaml \
    --stack-name "${AWS_NAMESPACE}-subscriptions-stack" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
      AwsNamespace="${AWS_NAMESPACE}" \
      AwsAppSyncUrl=${AWS_APPSYNC_URL}
```

#### Delete AWS Lambda's S3 stack
```
aws s3 rm "s3://${AWS_NAMESPACE}-lambda-60b77a97-ed05-45e2-a19f-2f0d1ec7dd63" --recursive || true
```

```
aws cloudformation delete-stack \
  --stack-name "${AWS_NAMESPACE}-subscriptions-lambda-s3"
```

#### Delete AWS Lambda stack
```
aws cloudformation delete-stack \
  --stack-name "${AWS_NAMESPACE}-subscriptions-stack"
```

#### Test addHumansLambda, AWS Lambda Payload
```json
{
  "cognitoIdentityId": "us-east-1:b2ecfe41-616f-4cca-a212-2ac82d6e3fdd",
  "humanIds": [
    "1002"
  ]
}
```
