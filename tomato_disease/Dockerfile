FROM python:3.11

WORKDIR /code

# Copy requirements first for better caching
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install gunicorn

# Copy the rest of your app
COPY . .

# Hugging Face routes external traffic to port 7860
ENV FLASK_APP=app.py
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app", "--timeout", "120"]
