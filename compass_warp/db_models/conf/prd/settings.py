from pymongo import MongoClient

import logging

logger = logging.getLogger(__name__)

MONGODB_HOST = "localhost"
MONGODB_PORT = 2007
try:
    MongoConn = MongoClient(host=MONGODB_HOST, port=MONGODB_PORT)
except Exception as e:
    logger.error("MongoDB Init Failed Exception:{0}".format(e))
