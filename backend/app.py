from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)


# 1. Home API
@app.route("/")
def home():
    return "Student Management System API Running"


# 2. Add Student
@app.route("/students", methods=["POST"])
def add_student():

    data = request.json

    name = data["name"]
    email = data["email"]
    age = data["age"]
    course = data["course"]

    db = get_db_connection()
    cursor = db.cursor()

    sql = """
    INSERT INTO students (name, email, age, course)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(sql, (name, email, age, course))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Student Added Successfully"}), 201


# 3. View All Students
@app.route("/students", methods=["GET"])
def get_students():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM students")

    students = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(students)


# 4. Update Student
@app.route("/students/<int:id>", methods=["PUT"])
def update_student(id):

    data = request.json

    db = get_db_connection()
    cursor = db.cursor()

    sql = """
    UPDATE students
    SET name=%s, email=%s, age=%s, course=%s
    WHERE id=%s
    """

    cursor.execute(
        sql,
        (
            data["name"],
            data["email"],
            data["age"],
            data["course"],
            id
        )
    )

    db.commit()

    updated = cursor.rowcount

    cursor.close()
    db.close()

    if updated == 0:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"message": "Student Updated Successfully"})


# 5. Delete Student
@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM students WHERE id=%s",
        (id,)
    )

    db.commit()

    deleted = cursor.rowcount

    cursor.close()
    db.close()

    if deleted == 0:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"message": "Student Deleted Successfully"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)