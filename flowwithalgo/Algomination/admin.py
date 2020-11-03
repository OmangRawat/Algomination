from django.contrib import admin

# Register your models here.
from .models import Client, Opinion, Project, Cont

admin.site.register(Client)
admin.site.register(Opinion)
admin.site.register(Project)
admin.site.register(Cont)

