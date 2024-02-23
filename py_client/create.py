import requests

endpoint = "http://localhost:8000/api/products/"

data = {
    "title": "milk",
    "price": 8.57
}
headers = {
    # 'Authorization': 'Token a187410694202f25478b80b7e7fa1cd7eb451632'
    'Authorization': 'Bearer a187410694202f25478b80b7e7fa1cd7eb451632'
}
get_response = requests.post(endpoint, json=data, headers=headers)

print("*************************************")
print("*************************************")
print(get_response.json())
print("*************************************")
print("*************************************")