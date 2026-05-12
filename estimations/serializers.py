from rest_framework import serializers
from .models import User, Inquiry, Estimation, Pricing

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'role', 'email_address', 'registration_date']

from django.conf import settings

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    secret_company_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email_address', 'password', 'secret_company_code']

    def create(self, validated_data):
        code = validated_data.pop('secret_company_code', None)
        role = 'employee' if code == settings.SECRET_COMPANY_CODE else 'client'
        
        user = User.objects.create_user(
            email_address=validated_data['email_address'],
            password=validated_data['password'],
            role=role
        )
        return user

class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pricing
        fields = '__all__'

class EstimationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estimation
        fields = '__all__'
        read_only_fields = ['calculated_amount']

class InquirySerializer(serializers.ModelSerializer):
    estimations = EstimationSerializer(many=True, read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'client', 'client_address', 'client_phone', 'wall_surface_area', 'ceiling_surface_area',
            'number_of_windows', 'number_of_doors', 'selected_additional_services',
            'submission_date', 'estimations'
        ]
        read_only_fields = ['client']
