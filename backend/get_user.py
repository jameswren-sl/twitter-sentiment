import json
import tweepy
import logging
from os import environ

logger = logging.getLogger()
logger.setLevel(logging.INFO)

auth = tweepy.OAuthHandler(environ['twitter_consumer_key'], environ['twitter_consumer_secret'])
auth.set_access_token(environ['twitter_access_token'], environ['twitter_access_token_secret'])

api = tweepy.API(auth)


def lambda_handler(event, context):
    logger.info(event)
    user_id = event.get('pathParameters', {}).get('id')

    if not user_id:
        return {
            'statusCode': 400,
            'body': 'Missing user ID',
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }

    user = api.get_user(screen_name=user_id)

    response = {}
    response['name'] = user.name
    response['profileImageUrl'] = user.profile_image_url_https

    return {
            'statusCode': 200,
            'body': json.dumps(response),
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }
