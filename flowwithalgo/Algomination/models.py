from django.db import models

# Create your models here.
class Client(models.Model):
    client_id = models.AutoField
    name = models.CharField(max_length = 70, default="")
    email = models.CharField(max_length = 70, default="")
    password = models.CharField(max_length = 20, default="")

    def __str__(self):
        return self.name