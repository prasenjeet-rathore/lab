#!/usr/bin/env python3
"""Quick check: does the topic 'aml_transactions' have messages on the given broker?
   Run from host: KAFKA_BROKER=localhost:29092 python verify_topic.py
   Run in container: python verify_topic.py  (uses KAFKA_BROKER=kafka:9092 from env)
"""
import os
import sys
from confluent_kafka import Consumer

KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'kafka:9092')
TOPIC = 'aml_transactions'

def main():
    c = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': f'verify-{os.getpid()}',
        'auto.offset.reset': 'earliest',
    })
    c.subscribe([TOPIC])
    print(f"Broker: {KAFKA_BROKER}, topic: {TOPIC}. Polling for 10s...", flush=True)
    for _ in range(10):
        msg = c.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"Error: {msg.error()}", flush=True)
            break
        print(f"OK: got 1 message (partition={msg.partition()}, offset={msg.offset()})", flush=True)
        print(f"  value (first 200 chars): {msg.value()[:200]}", flush=True)
        c.close()
        return
    print("No message received in 10s. Topic may be empty or broker unreachable.", flush=True)
    c.close()
    sys.exit(1)

if __name__ == '__main__':
    main()
