from django.contrib import admin

from .models import CheckIn, Registration


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "event", "status", "created_at")
    list_filter = ("event", "status")
    search_fields = ("name", "email", "college")
    readonly_fields = ("id", "token", "created_at")


@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ("registration", "checked_in_at", "checked_in_by", "undone_at")
    list_filter = ("undone_at",)
