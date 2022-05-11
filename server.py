import requests
import pandas as pd
import joblib
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

vectorizer = joblib.load('vectorizer.pkl')
classifier = joblib.load('logistic_regression_classifier.pkl')

app = FastAPI()

origins = [
    "http://127.0.0.1:3000/",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@ app.get('/')
def root():
    return "Hello World"


@ app.post('/tweet/')
async def get_tweet(info: Request):
    req_info = await info.json()
    tweet_id = req_info["url"].split("/")[5]
    headers = {"Authorization": "Bearer {}".format(
        "AAAAAAAAAAAAAAAAAAAAAOlLcQEAAAAAU4CeF9EHclY2XP2fpGPAVJDb2CE%3DoVfqWcT8X2YO5gkt63srw0rf5wy61DEBqhQje2y8wjnqXXhhPZ")}
    response = requests.get(
        "https://api.twitter.com/2/tweets/{}".format(tweet_id), headers=headers)
    content = response.json()
    test = pd.DataFrame(columns=['text'])
    test = test.append(
        {'text': ''.join([content['data']['text']])}, ignore_index=True)
    example = vectorizer.transform(test['text'])
    y_pred = classifier.predict(example)
    return {"id": tweet_id, "sentiment": y_pred.tolist()[0]}
