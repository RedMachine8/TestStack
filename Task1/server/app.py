from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid

DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)

CORS(app)

ORGANIZATIONS = [
    {
      "id": uuid.uuid4().hex,
      "name": "Harry",
      "FIODir": "Haruki Murakami",
      "phone": "+7 000 321 765"
    },
    {
        "id": uuid.uuid4().hex,
        "name": "ИП Иванов С.С.",
        "FIODir": "Иванов С.С.",
        "phone": "+7 000 123 45 99"
    }
]


@app.route('/organizations', methods=['GET', 'POST'])
def all_books():
    response_object = {'status': 'success'}
    if request.method == 'POST':
        post_data = request.get_json()
        ORGANIZATIONS.append({
            'id': uuid.uuid4().hex,
            'name': post_data.get('name'),
            'FIODir': post_data.get('FIODir'),
            'phone': post_data.get('phone')
        })
        response_object['message'] = 'Организация добавлена!'
    else:
        response_object['orgs'] = ORGANIZATIONS
    return jsonify(response_object)


@app.route('/organizations/<string:org_id>', methods=['DELETE'])
def remove_org(org_id):
    for org in ORGANIZATIONS:
        if org['id'] == org_id:
            ORGANIZATIONS.remove(org)


def single_org(org_id):
    response_object = {'status': 'success'}
    if request.method == 'DELETE':
        remove_org(org_id)
        response_object['message'] = 'Организация удалена!'
    return jsonify(response_object)


if __name__ == '__main__':
    app.run()
