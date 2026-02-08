#!/usr/bin/env python3
"""Print topic list and partition offsets for the broker. Run in container: python broker_info.py"""
import os
import sys
from confluent_kafka import Consumer, TopicPartition

KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'kafka:9092')
TOPIC = 'aml_transactions'

def main():
    c = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': f'broker-info-{os.getpid()}',
        'auto.offset.reset': 'earliest',
    })
    try:
        # Get cluster metadata (topics and partitions)
        metadata = c.list_topics(topic=TOPIC, timeout=10)
        print(f"Broker: {KAFKA_BROKER}", flush=True)
        if TOPIC not in metadata.topics:
            print(f"Topic '{TOPIC}' does NOT exist on this broker.", flush=True)
            print("Existing topics:", list(metadata.topics.keys()), flush=True)
            sys.exit(1)
        t = metadata.topics[TOPIC]
        partition_ids = list(t.partitions.keys())
        print(f"Topic '{TOPIC}' exists. Partitions: {partition_ids}", flush=True)
        if not partition_ids:
            print("  (No partitions - topic may be on another broker or not ready. Run ensure_topic.py in this container, then producer.)", flush=True)
            sys.exit(1)
        for pid in partition_ids:
            try:
                low, high = c.get_watermark_offsets(TopicPartition(TOPIC, pid), timeout=5)
                print(f"  partition {pid}: low={low} high={high} (messages in range: {high - low})", flush=True)
            except Exception as e:
                print(f"  partition {pid}: error getting offsets: {e}", flush=True)
    except Exception as e:
        print(f"Error: {e}", flush=True)
        sys.exit(1)
    finally:
        c.close()

if __name__ == '__main__':
    main()
