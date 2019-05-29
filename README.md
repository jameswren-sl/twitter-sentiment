## Run backend locally

Requires: AWS SAM, python 3, pip. venv (Python virtual environments)

1. Create a python environment `python -m venv env`
2. Enter virtual environment `.\env\Scripts\activate`
3. Install application packages `pip install -r requirements.txt`
4. Build the application `sam build`
5. This is an optional step but I had issues with docker not being able to see the files correctly on Windows so I had to run `Set-NetConnectionProfile -interfacealias "vEthernet (DockerNAT)" -NetworkCategory Private` to change the network permission for it to work
6. Start the application locally `sam local start-api --parameter-overrides "ParameterKey=TwitterConsumerKey, ParameterValue=XXX ParameterKey=TwitterConsumerSecret, ParameterValue=XXX ParameterKey=TwitterAccessToken, ParameterValue=XXX ParameterKey=TwitterAccessTokenSecret, ParameterValue=XXX"`
7. After changes to the Lambda, the running application needs stopping, rebuilding and restarting

If any packages are installed, add them with `pip freeze > requirements.txt`

When finished leave Python virtual environment `deactivate`

## Deploy backend to AWS

1. Change to the backend directory `cd ./backend`
2. Build the application `sam build`
3. Change to the build directory `cd .aws-sam/build`
4. Create a S3 bucket to hold the code build or use an existing bucket
5. Package the build `sam package --s3-bucket <NAME_OF_BUCKET> --output-template-file packaged.yaml`
6. Deploy to AWS `sam deploy --template-file packaged.yaml --stack-name <STACK_NAME> --capabilities CAPABILITY_IAM --parameter-overrides "TwitterConsumerKey=XXX TwitterConsumerSecret=XXX TwitterAccessToken=XXX TwitterAccessTokenSecret=XXX"`
7. Get the URL from the output of the CloudFormation build ```aws cloudformation describe-stacks --query 'Stacks[?StackName==`<>STACK_NAME`][].Outputs[?OutputKey==`Endpoint`].OutputValue' --output text```
8. Replace the URL with the endpoint config value in `frontend/src/config.js`
