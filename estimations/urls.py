from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InquiryViewSet, EstimationViewSet, PricingViewSet, RegisterView, CustomAuthToken

router = DefaultRouter()
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
router.register(r'estimations', EstimationViewSet, basename='estimation')
router.register(r'pricing', PricingViewSet, basename='pricing')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('', include(router.urls)),
]
