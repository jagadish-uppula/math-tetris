from flask import Flask, render_template, request, jsonify
import random
from werkzeug.middleware.proxy_fix import ProxyFix

# IMPORTANT: Set template + static folder paths correctly for Vercel
app = Flask(__name__, static_folder="../static", template_folder="../templates")

# Fix for Vercel reverse proxy
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/start_game", methods=["POST"])
def start_game():
    player_name = request.form.get("player_name")
    return render_template("game.html", player_name=player_name)


@app.route("/generate_problem")
def generate_problem():
    difficulty = request.args.get("difficulty", "easy")

    if difficulty == "easy":
        num1 = random.randint(1, 10)
        num2 = random.randint(1, 10)
        ops = ["+", "-", "*", "/"]

    elif difficulty == "medium":
        num1 = random.randint(-20, 20)
        num2 = random.randint(-20, 20)
        ops = ["+", "-", "*", "/"]

    else:  # hard
        num1 = random.randint(-50, 50)
        num2 = random.randint(-50, 50)
        ops = ["+", "-", "*", "/", "(", ")"]

    op = random.choice(ops)

    if op == "(":
        num3 = random.randint(1, 10)
        problem = f"({num1} + {num2}) * {num3}"
        answer = (num1 + num2) * num3

    elif op == ")":
        num3 = random.randint(1, 10)
        problem = f"{num1} * ({num2} + {num3})"
        answer = num1 * (num2 + num3)

    else:
        problem = f"{num1} {op} {num2}"
        try:
            answer = eval(problem)
        except:
            answer = num1 + num2

    if isinstance(answer, float):
        answer = round(answer, 2)

    options = [answer]

    while len(options) < 4:
        if isinstance(answer, int):
            wrong = answer + random.choice([-3, -2, -1, 1, 2, 3])
        else:
            wrong = round(answer + random.choice([-0.5, -0.3, -0.1, 0.1, 0.3, 0.5]), 2)

        if wrong not in options:
            options.append(wrong)

    random.shuffle(options)

    return jsonify({
        "problem": problem,
        "options": options,
        "answer": answer
    })


# Entry point Vercel needs
def handler(event, context):
    return app(event, context)
