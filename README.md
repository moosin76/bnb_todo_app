# 비앤비 스터디 홈페이지 만들기 강의  (todo-app)

## Backend/.env
```
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_DATABASE=
SECRET_KEY=
```

## DB 생성
```
docker run --name bnbdb -v C:/Data/Project/BnB/docker_data/db:/var/lib/mysql -v C:/Data/Project/BnB/docker_data/conf:/etc/mysql/conf.d -p 3308:3306 -e MARIADB_ROOT_PASSWORD=1234  -d mariadb:latest
```