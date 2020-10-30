from django.db import models

# Create your models here.
class Card(models.Model):
    card_id = models.AutoField
    card_value = models.CharField(max_length = 50, default="")
   
    def __str__(self):
        return self.card_value