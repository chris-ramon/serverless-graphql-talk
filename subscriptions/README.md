export AWS_NAMESPACE=starwars
export AWS_APPSYNC_URL=https://gsmnq7rf6vejjf7uu5mbdff4yy.appsync-api.us-east-1.amazonaws.com/graphql

aws cloudformation deploy \
  --template-file lambda-s3.yaml \
  --stack-name "${AWS_NAMESPACE}-subscriptions-lambda-s3" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides AwsNamespace="${AWS_NAMESPACE}"

aws cloudformation package \
    --template-file template.yaml \
    --s3-bucket "${AWS_NAMESPACE}-lambda-58d3c996-bc32-4636-8ece-b7b7b605066e"\
    --output-template-file packaged-template.yaml

aws cloudformation deploy \
    --template-file packaged-template.yaml \
    --stack-name "${AWS_NAMESPACE}-subscriptions-stack" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
      AwsNamespace="${AWS_NAMESPACE}" \
      AwsAppSyncUrl=${AWS_APPSYNC_URL}
