import os
from minio import Minio
from minio.error import S3Error
from datetime import timedelta


MINIO_PUBLIC_URL = os.getenv("MINIO_PUBLIC_URL", "http://localhost:9000")
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"


MAX_FILE_SIZE = 5 * 1024 * 1024  
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "pillbox")


class MinIOClient:
    
    def __init__(self):
        self.client = Minio(
            "minio:9000",
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=MINIO_SECURE
        )
    
    def ensure_bucket_exists(self, bucket_name: str) -> bool:
        try:
            if not self.client.bucket_exists(bucket_name):
                self.client.make_bucket(bucket_name)
                print(f"Bucket '{bucket_name}' created successfully")
            else:
                print(f"Bucket '{bucket_name}' already exists")
            return True
        except S3Error as e:
            print(f"Error creating bucket: {e}")
            return False
    
    def upload_file(self, bucket_name: str, object_name: str, file_data, content_type: str) -> bool:
        try:
            self.ensure_bucket_exists(bucket_name)
            file_data.seek(0, 2)  
            size = file_data.tell()
            file_data.seek(0) 
            
            self.client.put_object(
                bucket_name,
                object_name,
                file_data,
                length=size,
                content_type=content_type
            )
            return True
        except S3Error as e:
            print(f"Upload error: {e}")
            raise
    
    def get_presigned_url(self, bucket_name: str, object_name: str, expires: int = 3600) -> str:
        try:
            public_url = os.getenv("MINIO_PUBLIC_URL", "http://localhost:9000")
            
            return f"{public_url}/{bucket_name}/{object_name}"
        except S3Error as e:
            print(f"Presigned URL error: {e}")
            raise
    
    def remove_object(self, bucket_name: str, object_name: str) -> bool:
        try:
            self.client.remove_object(bucket_name, object_name)
            return True
        except S3Error as e:
            print(f"Delete error: {e}")
            raise


minio_client = MinIOClient()

def init_bucket():
    print(f"Initializing MinIO bucket: {BUCKET_NAME}")
    minio_client.ensure_bucket_exists(BUCKET_NAME)
    print(f"MinIO bucket '{BUCKET_NAME}' is ready")