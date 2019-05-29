import json
import boto3
import tweepy
import logging
from os import environ

logger = logging.getLogger()
logger.setLevel(logging.INFO)

comprehend = boto3.client('comprehend')

auth = tweepy.OAuthHandler(environ['twitter_consumer_key'], environ['twitter_consumer_secret'])
auth.set_access_token(environ['twitter_access_token'], environ['twitter_access_token_secret'])

api = tweepy.API(auth)


def get_tweets(api_method, *args, **kwargs):
    return tweepy.Cursor(api_method, *args, count=100, tweet_mode='extended', **kwargs).pages(5)


def get_tweet_text(status):
    if hasattr(status, 'retweeted_status'):
        return status.retweeted_status.full_text
    elif hasattr(status, 'full_text'):
        return status.full_text
    else:
        return status.text


def get_sentiments(tweets):
    response = comprehend.batch_detect_sentiment(
            TextList=tweets,
            LanguageCode='en'
        )

    sentiments = list(map(lambda result: result.get('SentimentScore', {}), response.get('ResultList', [])))

    for error in response.get('ErrorList', []):
        logger.info(f"Failed to process message. {error.get('ErrorCode', 0)} - {error.get('ErrorMessage', 'No message')}")

    return sentiments


def aggregate_results(sentiments, category):
    if len(sentiments) == 0:
        return 0

    return sum(sentiment.get(category, 0) for sentiment in sentiments) / len(sentiments)


def lambda_handler(api_method, *args, **kwargs):
    sentiments = []

    for page in get_tweets(api_method, *args, **kwargs):
        tweets = []
        for tweet in page:
            tweets.append(get_tweet_text(tweet))

            if len(tweets) == 25:
                sentiments = sentiments + get_sentiments(tweets)
                tweets = []

    if len(tweets) > 0:
        sentiments = sentiments + get_sentiments(tweets)

    positive = aggregate_results(sentiments, 'Positive')
    negative = aggregate_results(sentiments, 'Negative')
    neutral = aggregate_results(sentiments, 'Neutral')
    mixed = aggregate_results(sentiments, 'Mixed')

    logger.info(f'Tweets processed {len(sentiments)}')

    return {
        'statusCode': 200,
        'body': json.dumps({
            'tweetCount': len(sentiments),
            'positive': positive,
            'negative': negative,
            'neutral': neutral,
            'mixed': mixed
        }),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }


def search_sentiment_handler(event, context):
    logger.info(event)
    if not event.get('queryStringParameters') or not event.get('queryStringParameters').get('q'):
        return {
            'statusCode': 400,
            'body': 'A query string "q" parameter is required',
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }

    query = event.get('queryStringParameters').get('q')

    logger.info(f'Searching for {query}')

    return lambda_handler(api.search, query, result_type='recent')


def user_sentiment_handler(event, context):
    logger.info(event)

    if not event.get('queryStringParameters') or not event.get('queryStringParameters').get('user'):
        return {
            'statusCode': 400,
            'body': 'A query string "user" parameter is required',
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }

    user_id = event.get('queryStringParameters').get('user')
    logger.info(f'Searching {user_id}')

    return lambda_handler(api.user_timeline, screen_name=user_id)
