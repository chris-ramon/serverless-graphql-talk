export AWS_NAMESPACE=starwars

aws cloudformation deploy \
  --template-file lambda-s3.yaml \
  --stack-name "${AWS_NAMESPACE}-lambda-s3" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides AwsNamespace="${AWS_NAMESPACE}"

aws cloudformation package \
    --template-file template.yaml \
    --s3-bucket "${AWS_NAMESPACE}-lambda-690d83c9-b2ba-4c13-a111-4c6e2de2a38a" \
    --output-template-file packaged-template.yaml

aws cloudformation deploy \
    --template-file packaged-template.yaml \
    --stack-name "${AWS_NAMESPACE}-stack" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
      AwsNamespace="${AWS_NAMESPACE}"
