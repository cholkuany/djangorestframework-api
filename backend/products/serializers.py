from rest_framework import serializers
from rest_framework.reverse import reverse

from .validators import validate_title
from .validators import unique_product_title
from api.serializer import UserPublicSerializer

from .models import Product

class ProductInlinerSerializer(serializers.Serializer):
    title = serializers.CharField(read_only=True)
    id = serializers.IntegerField(read_only=True)
    url_hyperlinked = serializers.HyperlinkedIdentityField(
        view_name='product-detail', 
        lookup_field='pk',
        read_only=True
        )


class ProductSerializer(serializers.ModelSerializer):
    # related_products = ProductInlinerSerializer(source='user.product_set.all', many=True)
    owner = UserPublicSerializer(source='user', read_only=True)
    # user_data = serializers.SerializerMethodField(read_only=True)
    # discount = serializers.SerializerMethodField(read_only=True)
    url = serializers.SerializerMethodField(read_only=True)
    url_hyperlinked = serializers.HyperlinkedIdentityField(
        view_name='product-detail', 
        lookup_field='pk'
        )
    title = serializers.CharField(validators=[validate_title, unique_product_title])
    # email = serializers.EmailField(source='user.email', read_only=True)
    body = serializers.CharField(source='content')
    class Meta:
        model = Product
        fields = [
            'owner',
            # 'related_products',
            'url_hyperlinked',
            'url',
            'endpoint',
            'pk',
            'title',
            'body',
            'price',
            'sale_price',
            # 'discount',
            # 'user_data',
        ]
    # def create(self, validated_data):
    #     # email = validated_data.pop('email')
    #     return super().create(validated_data)
    
    # def update(self, instance, validated_data):
    #     email = validated_data.pop('email')
    #     return super().update(instance, validated_data)

    # def validate_title(self, value):
    #     qs = Product.objects.filter(title__iexact=value)
    #     if qs.exists():
    #         raise serializers.ValidationError(f"{value} is already a product name.")
    #     return value
    def get_user_data(self, obj):
        return {
            "user_data": obj.user.username
        }
    def get_url(self, obj):
        request = self.context.get('request')
        if request is None:
            return None
        return reverse("product-detail", kwargs={"pk": obj.pk}, request=request)
        # return f'/api/products/{obj.pk}'

    def get_discount(self, obj):
        return obj.get_discount()