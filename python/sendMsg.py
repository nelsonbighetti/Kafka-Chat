import argparse
import json
import time
from kafka import KafkaProducer

def main():
    argsParser = argparse.ArgumentParser()
    argsParser.add_argument("-u", "--user", dest="user", required=True)
    argsParser.add_argument("-uid", "--user_id", dest="uid", required=True)
    argsParser.add_argument("-msg", "--message", dest="msg", required=True)
    args = argsParser.parse_args()

    data = {
        "username": args.user,
        "uid": args.uid,
        "msg": args.msg,
        "ts" : time.time()
    }
    json_string = json.dumps(data)

    producer = KafkaProducer(bootstrap_servers='localhost:9092')
    producer.send('kafka-chat', bytes(json_string, 'utf8'))


if __name__ == "__main__":
    main()

