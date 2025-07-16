import time
import os
import psycopg2

host = os.getenv('POSTGRES_HOST', 'db')
port = int(os.getenv('POSTGRES_PORT', 5432))
db = os.getenv('POSTGRES_DB', 'production-db')
user = os.getenv('POSTGRES_USER', 'postgres')
password = os.getenv('POSTGRES_PASSWORD', '')

while True:
    try:
        conn = psycopg2.connect(host=host, port=port, dbname=db, user=user, password=password)
        conn.close()
        break
    except psycopg2.OperationalError:
        print('Waiting for database...', flush=True)
        time.sleep(1)

