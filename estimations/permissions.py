from rest_framework import permissions

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'client')

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'employee')

class IsOwnerOrEmployee(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'employee':
            return True
        if hasattr(obj, 'client'):
            return obj.client == request.user
        if hasattr(obj, 'inquiry'):
            return obj.inquiry.client == request.user
        return False
