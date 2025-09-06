FROM gcc:latest

WORKDIR /usr/src/app

COPY . .

CMD ["bash", "run-grader.sh"]