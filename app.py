from flask import Flask, render_template
import os

app = Flask(__name__)
app.config["SECRET"] = os.getenv("MCPROT_SECRET")

APP_HOST = os.getenv("MCPROT_HOST")
APP_PORT = os.getenv("MCPROT_PORT")
APP_DEBUG = os.getenv("MCPROT")

@app.route('/')
def index():
  return render_template("dashboard.html", title="")

if __name__ == "__main__":
  app.run(host=APP_HOST, port=APP_PORT, debug=(APP_DEBUG.upper() == "TRUE"))
