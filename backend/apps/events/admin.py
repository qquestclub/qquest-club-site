from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("slug", "starts_at", "registration_status", "capacity")
    list_filter = ("registration_status",)
    search_fields = ("slug",)
