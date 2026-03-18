# Load celery app khi Django khởi động
from .celeryapp import app as celery_app

__all__ = ("celery_app",)
