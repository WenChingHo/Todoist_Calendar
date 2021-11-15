
from flask_cors import CORS
from flask_restful import Resource, Api
from flask import Flask, render_template_string, request, session,abort, Response
from todoist.api import TodoistAPI
from datetime import datetime
import calendar
import json

# Create the Flask application
app = Flask(__name__)
CORS(app)
api = Api(app)
# Details on the Secret Key: https://flask.palletsprojects.com/en/1.1.x/config/#SECRET_KEY
# NOTE: The secret key is used to cryptographically-sign the cookies used for storing
#       the session data.
app.secret_key = 'BAD_SECRET_KEY'

class Todoist(Resource):
    def get(self):  
        todoistApi = TodoistAPI(request.args.get("api"))
        month = str(int(request.args.get("month"))+1)
        year = str(request.args.get("year"))
        if "error_code" in todoistApi.sync().keys():
            return abort(Response(400,"Invalid API key"))
        # Get Tasks
        items = []
        for i in todoistApi.state["items"]:

            if i["due"] and i["due"].get("date")[5:7] == month and i["due"].get("date")[:4] == year and i["checked"]==0:
                items.append({
                    "content":i["content"],
                    "due": i["due"].get("date"),
                    "description": i["description"],
                    "id" :i["id"],
                    "type": "task"
                })
                #strDate = i["due"].get("date") + "T00:00:00" if len(i["due"].get("date")) ==10 else i["due"].get("date")
                #date = datetime.strptime( strDate, "%Y-%m-%dT%H:%M:%S")

        # Get Completed Tasks
        today = datetime.now()
        _ , daysInMonth = calendar.monthrange(today.year, int(month))

        completed_tasks = todoistApi.completed.get_all(
            since=f'{today.year}-{str(month).zfill(2)}-01T00:00',
            until=f'{today.year}-{str(month).zfill(2)}-{daysInMonth}T00:00'
            )['items']
        for item in completed_tasks: 
            item['type']='completed'
            item["due"] = item.pop("completed_date")
        print(items)
        return {"user":todoistApi.state.get("user"), 
                "tasks" :items, 
                "completed": completed_tasks}, 200

    def post(self):
        pass

api.add_resource(Todoist, '/connect')


if __name__ == '__main__':
    app.run(debug=True)
