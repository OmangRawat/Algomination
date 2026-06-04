from django.contrib import admin

from .models import ContactMessage, Opinion, Project


@admin.register(Opinion)
class OpinionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email", "message")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "algorithm", "github_url", "created_at")
    search_fields = ("name", "algorithm", "email")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email", "message")
