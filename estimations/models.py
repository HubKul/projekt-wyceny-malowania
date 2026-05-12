from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email_address, password=None, **extra_fields):
        if not email_address:
            raise ValueError('Email address is required')
        user = self.model(email_address=self.normalize_email(email_address), **extra_fields)
        if password:
            user.set_password(password)
            user.password_hash = user.password
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    ROLE_CHOICES = [
        ('client', 'client'),
        ('employee', 'employee'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email_address = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=128)
    registration_date = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email_address'

class Inquiry(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    client_address = models.CharField(max_length=255, default='', blank=True)
    client_phone = models.CharField(max_length=50, default='', blank=True)
    wall_surface_area = models.DecimalField(max_digits=10, decimal_places=2)
    ceiling_surface_area = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_windows = models.IntegerField(default=0)
    number_of_doors = models.IntegerField(default=0)
    selected_additional_services = models.JSONField(default=list)
    submission_date = models.DateTimeField(auto_now_add=True)

class Estimation(models.Model):
    STATUS_CHOICES = [
        ('new', 'new'),
        ('estimated', 'estimated'),
        ('accepted', 'accepted'),
        ('rejected', 'rejected'),
    ]
    inquiry = models.ForeignKey(Inquiry, on_delete=models.CASCADE, related_name='estimations')
    calculated_amount = models.DecimalField(max_digits=10, decimal_places=2)
    final_updated_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    inquiry_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='new')

class Pricing(models.Model):
    service_name = models.CharField(max_length=255)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
