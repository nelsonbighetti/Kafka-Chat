import argparse
import json
import time

from kafka import KafkaConsumer, TopicPartition

def main():
    argsParser = argparse.ArgumentParser()
    argsParser.add_argument("-uid", "--user_id", dest="uid", required=True)
    argsParser.add_argument("-ts", "--timestamp", dest="ts", required=True)
    args = argsParser.parse_args()

    timestamp_current = time.time()
    update_timestamp_client = float(args.ts)
    if(update_timestamp_client<10):
        update_timestamp_client = timestamp_current


    tp = TopicPartition('kafka-chat', 0)
    consumer = KafkaConsumer(bootstrap_servers='localhost:9092')
    consumer.assign([tp])

    consumer.seek_to_end(tp)
    lastOffset = consumer.position(tp)

    consumer.seek_to_beginning(tp)
    messagesReceived = []
    newMsg = False
    for message in consumer:
        if message is not None:
            try:
                data = json.loads(message.value)
                if(update_timestamp_client<data['ts'] and args.uid!=data['uid']):
                    messagesReceived.append({"name" : data['username'],"msg" : data['msg']})
                if message.offset == lastOffset - 1:
                    break
            except:
                if message.offset == lastOffset - 1:
                    break
                continue

    if(len(messagesReceived)>0):
        newMsg=True

    output = {
        "new" : newMsg,
        "msg_list" : json.dumps(messagesReceived),
        "ts" : timestamp_current
    }

if __name__ == "__main__":
    main()
