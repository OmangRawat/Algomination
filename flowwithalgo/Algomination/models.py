from django.db import models

# Create your models here, omang backend cum frontend
class Client(models.Model):
    client_id = models.AutoField
    name = models.CharField(max_length = 70, default="")
    email = models.CharField(max_length = 70, default="")
    password = models.CharField(max_length = 20, default="")

    def __str__(self):
        return self.name

class Opinion(models.Model):
    opinion_id = models.AutoField
    name = models.CharField(max_length = 70, default="")
    email = models.CharField(max_length = 70, default="")
    desc = models.CharField(max_length = 500, default="")

    def __str__(self):
        return self.name

class Project(models.Model):
    project_id = models.AutoField
    name = models.CharField(max_length = 70, default="")
    algo = models.CharField(max_length = 70, default="")
    git_link = models.CharField(max_length = 100, default="")
    email = models.CharField(max_length = 70, default="")

    def __str__(self):
        return self.name

class Cont(models.Model):
    contact_id = models.AutoField
    name = models.CharField(max_length = 70, default="")
    email = models.CharField(max_length = 70, default="")
    desc = models.CharField(max_length = 500, default="")

    def __str__(self):
        return self.name        
                
