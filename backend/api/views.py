from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view

from products.models import Product
from products.serializers import ProductSerializer

@api_view(['POST'])
def api_home(request, *args, **kwargs):
    """
    DRF API View
    """
    instance = Product.objects.all().order_by("?").first()
    data = {}
    serializer = ProductSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        # instance = serializer.save()
        print(serializer.data)
        return Response(serializer.data)
    # if instance:
        # data = model_to_dict(instance, fields=['id', 'title', 'price'])
        # data = ProductSerializer(instance).data

    return Response({"Invalid": "Incorrect data"}, status=400)
