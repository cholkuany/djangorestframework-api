import requests

endpoint = "http://localhost:8000/api/products/1/update/"

data = {
    "price": 80.56
}

get_response = requests.put(endpoint, json=data)

print(get_response.json())