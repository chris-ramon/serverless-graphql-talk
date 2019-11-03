export AWS_NAMESPACE=starwars
export AWS_PROFILE=YOUR_AWS_PROFILE

aws cloudformation deploy \
  --template-file lambda-s3.yaml \
  --stack-name "${AWS_NAMESPACE}-lambda-s3" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides AwsNamespace="${AWS_NAMESPACE}"

aws cloudformation package \
    --template-file template.yaml \
    --s3-bucket "${AWS_NAMESPACE}-lambda-5b58ddba-b724-48a2-8afb-e39096af6ecf" \
    --output-template-file packaged-template.yaml

aws cloudformation deploy \
    --template-file packaged-template.yaml \
    --stack-name "${AWS_NAMESPACE}-stack" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
      AwsNamespace="${AWS_NAMESPACE}"

aws cloudformation delete-stack \
  --stack-name "${AWS_NAMESPACE}-lambda-s3"

aws cloudformation delete-stack \
	--stack-name "${AWS_NAMESPACE}-stack"
