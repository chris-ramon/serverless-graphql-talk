### Environment Variables.
export AWS_NAMESPACE=starwars
export AWS_PROFILE=YOUR_AWS_PROFILE

### Deploy AWS Lambda's S3
aws cloudformation deploy \
  --template-file lambda-s3.yaml \
  --stack-name "${AWS_NAMESPACE}-lambda-s3" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides AwsNamespace="${AWS_NAMESPACE}"

### Package AWS AppSync & related resources.
aws cloudformation package \
    --template-file template.yaml \
    --s3-bucket "${AWS_NAMESPACE}-lambda-5b58ddba-b724-48a2-8afb-e39096af6ecf" \
    --output-template-file packaged-template.yaml

### Deploy AWS AppSync & related resources.
aws cloudformation deploy \
    --template-file packaged-template.yaml \
    --stack-name "${AWS_NAMESPACE}-stack" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
      AwsNamespace="${AWS_NAMESPACE}"

### Delete AWS Lambda's S3 stack.
aws cloudformation delete-stack \
  --stack-name "${AWS_NAMESPACE}-lambda-s3"

### Delete AWS AppSync & related resources.
aws cloudformation delete-stack \
	--stack-name "${AWS_NAMESPACE}-stack"


### Test Subscription.
mutation {
  addHumans(channel: "USER_IDENTITY_ID", input: {
    id: "987",
    name: "Test Human!",
    homePlanet: "Earth"
  }) {
    channel
    humans {
      id
      name
    }
  }
}
