from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from decimal import Decimal
from .models import Inquiry, Estimation, Pricing
from .serializers import InquirySerializer, EstimationSerializer, PricingSerializer, RegistrationSerializer
from .permissions import IsClient, IsEmployee, IsOwnerOrEmployee

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'role': user.role,
            'email': user.email_address
        })

class RegisterView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'role': user.role,
                'email': user.email_address
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InquiryViewSet(viewsets.ModelViewSet):
    serializer_class = InquirySerializer

    def get_queryset(self):
        if self.request.user.role == 'employee':
            return Inquiry.objects.all()
        return Inquiry.objects.filter(client=self.request.user)

    def get_permissions(self):
        if self.action in ['create']:
            return [IsClient()]
        return [IsOwnerOrEmployee()]

    def perform_create(self, serializer):
        inquiry = serializer.save(client=self.request.user)
        
        wall_area = float(inquiry.wall_surface_area)
        ceiling_area = float(inquiry.ceiling_surface_area)
        windows = int(inquiry.number_of_windows)
        doors = int(inquiry.number_of_doors)
        
        total_deductions = (windows * 1.5) + (doors * 2.0)
        paintable_wall_area = max(wall_area - total_deductions, 0.0)
        net_area = paintable_wall_area + ceiling_area
        
        calculated_amount = 0.0
        
        services_to_price = list(inquiry.selected_additional_services)
        if 'double painting' not in services_to_price:
            services_to_price.append('double painting')
            
        prices = Pricing.objects.filter(service_name__in=services_to_price)
        price_map = {p.service_name: float(p.unit_price) for p in prices}
        
        default_prices = {
            'double painting': 20.0,
            'priming': 5.0,
            'foil protection': 2.0
        }
        
        for service in services_to_price:
            unit_price = price_map.get(service, default_prices.get(service, 10.0))
            calculated_amount += net_area * unit_price
            
        Estimation.objects.create(
            inquiry=inquiry,
            calculated_amount=Decimal(str(round(calculated_amount, 2))),
            inquiry_status='new'
        )

    @action(detail=True, methods=['put', 'patch'], permission_classes=[IsEmployee])
    def update_estimation(self, request, pk=None):
        inquiry = self.get_object()
        estimation = inquiry.estimations.first()
        if not estimation:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        if estimation.inquiry_status in ['accepted', 'rejected']:
            return Response({'error': 'The current status is final and cannot be modified.'}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = EstimationSerializer(estimation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[IsClient])
    def respond_estimation(self, request, pk=None):
        inquiry = self.get_object()
        estimation = inquiry.estimations.first()
        if not estimation:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        if estimation.inquiry_status in ['accepted', 'rejected']:
            return Response({'error': 'The current status is final and cannot be modified.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if estimation.inquiry_status != 'estimated':
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        new_status = request.data.get('inquiry_status')
        if new_status not in ['accepted', 'rejected']:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        estimation.inquiry_status = new_status
        estimation.save()
        return Response(EstimationSerializer(estimation).data)

class EstimationViewSet(viewsets.ModelViewSet):
    serializer_class = EstimationSerializer

    def get_queryset(self):
        if self.request.user.role == 'employee':
            return Estimation.objects.all()
        return Estimation.objects.filter(inquiry__client=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [IsEmployee()]
        return [IsOwnerOrEmployee()]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.inquiry_status in ['accepted', 'rejected']:
            return Response({'error': 'The current status is final and cannot be modified.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

class PricingViewSet(viewsets.ModelViewSet):
    queryset = Pricing.objects.all()
    serializer_class = PricingSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEmployee()]
        return []
