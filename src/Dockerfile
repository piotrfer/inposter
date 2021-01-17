FROM python:3-slim
RUN mkdir /app
WORKDIR /app
ADD requirements.txt /app
RUN pip install -r requirements.txt
ADD . /app
EXPOSE 5000
ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]