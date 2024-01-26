#!/bin/bash

EKS_CLUSTER_NAME="object-storage-operator-dev"
ROLE_PATH="./hack/s3-role.json"
POLICY_PATH="./hack/s3-policy.json"
ROLE_NAME="object-storage-operator-role"
POLICY_NAME="object-storage-operator-policy"

setup() {
    TMP_ROLE_PATH="$(mktemp)"

    cp "$ROLE_PATH" "$TMP_ROLE_PATH"
    replace_vars "$TMP_ROLE_PATH"

    ROLE_OUTPUT="$(aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document "file://$TMP_ROLE_PATH")"
    aws iam create-policy --policy-name "$POLICY_NAME" --policy-document "file://$POLICY_PATH"
    POLICY_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:policy/$POLICY_NAME"
    aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn "$POLICY_ARN"
    echo "IAM role and policy setup complete."

    ROLE_ARN="$(echo "$ROLE_OUTPUT" | jq -r '.Role.Arn')"
    echo "IAM role ARN: $ROLE_ARN"

    rm -f "$TMP_ROLE_PATH"
}

teardown() {
    aws iam detach-role-policy --role-name "$ROLE_NAME" --policy-arn "$POLICY_ARN"
    aws iam delete-policy --policy-arn "$POLICY_ARN"
    aws iam delete-role --role-name "$ROLE_NAME"
    echo "IAM role and policy deletion complete."
}

replace_vars() {
    local role_file=$1
    local output_content=""

    while IFS= read -r line || [[ -n "$line" ]]; do
        line=${line//\{\{AWS_ACCOUNT_ID\}\}/$AWS_ACCOUNT_ID}
        line=${line//\{\{OIDC_PROVIDER_ID\}\}/$OIDC_PROVIDER_ID}
        output_content+="$line\n"
    done < "$role_file"

    echo -e "$output_content" > "$role_file"
}

OIDC_PROVIDER_ID=$(aws eks describe-cluster --name "$EKS_CLUSTER_NAME" --query "cluster.identity.oidc.issuer" --output text | sed -e "s~https://oidc.eks.us-west-2.amazonaws.com/id/~~")
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
POLICY_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:policy/$POLICY_NAME"

echo "OIDC Provider ID: $OIDC_PROVIDER_ID"
echo "AWS Account ID: $AWS_ACCOUNT_ID"

case "$1" in
    setup)
        setup
        ;;
    teardown)
        teardown
        ;;
    *)
        echo "Error: Invalid or no argument provided. Please use 'setup' or 'teardown'."
        exit 1
        ;;
esac
