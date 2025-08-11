<img width="2880" height="1718" alt="image" src="https://github.com/user-attachments/assets/79829e56-10a6-4675-929e-39390d89b80d" /># Next.js-Docker-Nginx
### 1) Поставил сервер ( лучше 20-30 g ssd, 4 cpu и 8 Ram )
#### -  curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
#### -  sudo GITLAB_ROOT_PASSWORD="<пароль>" EXTERNAL_URL="https://<домен>" apt-get install gitlab-ce
### 2) сделал ci/cd 

```
stages:
  - build
  - docker_build
  - deploy

variables:
  DOCKER_IMAGE: allower99/project2-nginx-frontend:latest
  SSH_USER: user
  SSH_HOST: ip
  SSH_PATH: /home/user1/my-nextjs-nginx3

build_app:
  stage: build
  tags:
    - myserver-runner
  script:
    - rm -rf build nextjs-app/.next
    - cd nextjs-app
    - npm ci
    - npm run build
    - cp -r .next ../build/_next        
    - cp -r public ../build/public
  artifacts:
    paths:
      - build

docker_build:
  stage: docker_build
  tags:
    - myserver-runner
  dependencies:
    - build_app
  script:
    - ls -la build       
    - docker build -t $DOCKER_IMAGE .
    - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    - docker push $DOCKER_IMAGE


deploy:
  stage: deploy
  tags:
    - myserver-runner
  before_script:
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY_BASE64" | base64 -d > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $SSH_HOST >> ~/.ssh/known_hosts
  script:
    - ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "
        echo '🚀 Начинаем деплой...';
        cd $SSH_PATH &&
        docker-compose down &&
        docker-compose pull &&
        docker-compose up -d --force-recreate
      "
  when: manual

```

3) <img width="2852" height="1484" alt="image" src="https://github.com/user-attachments/assets/6849d0a7-4ef2-4c8b-a7ae-4dcb344624cc" />
------
<img width="2818" height="468" alt="image" src="https://github.com/user-attachments/assets/813f9250-0f07-4782-b320-b495174ad9d3" />


### Инфракструктура  - 1 сервер nginx + frontend лежал до ci/cd  ( сейчас тупо пулим из docker-compose образ ) в gitlab все
####                  - 2  сервер backend ( добавить для него тоже ci/cd) - также распологается в gitlab
####                  - 3 сервер db просто бд 
####                  - 4 сервер сам gitlab server и он же ranner в данном случае юзал shell как executor


#### тк ip адреса не статические (имбуля) - то нужно поменять 
#### 1) поменять в nginx.conf ip
#### 2) поменять в backende в app.js

```
// Конфиг подключения к вашей БД
const pool = new Pool({
  user: 'app_user',
  host: '158.160.187.123', // Замените на IP вашего сервера с PostgreSQL
  database: 'app_db',
  password: 'securepassword', // Пароль из вашего docker-compose.yml
  port: 5432,
});
```
### 3) в базе данных
```
docker exec -it db-server_postgres_1 sh -c "echo 'host all all 158.160.173.87/32 md5' >> /var/lib/postgresql/data/pg_hba.conf"
docker exec -it db-server_postgres_1 sh -c "echo \"listen_addresses = '*'\" >> /var/lib/postgresql/data/postgresql.conf"
```
### 4) домен allower.ru - ip 
### 5) меняем 1 пункт теперь только в gitlab тк там собирается образ , а на проде докер файла нету (
### 6) также поменять $SSH_HOST в переменных





### так же для настройки юзал ( команды которые мб потребуются ) 

```
1) pt update && apt install -y postgresql-client
2) psql -h 158.160.181.121 -U app_user -d app_db -W
3) добаляем user в docker группу 
4) ###### На сервере БД выполните:
docker exec -it db-server_postgres_1 sh -c "echo 'host all all 158.160.173.87/32 md5' >> /var/lib/postgresql/data/pg_hba.conf"
docker exec -it db-server_postgres_1 sh -c "echo \"listen_addresses = '*'\" >> /var/lib/postgresql/data/postgresql.conf"
6) ###### На сервере backend выполнить
docker build -t backend . && docker run -d \
  -p 3000:3000 \
  -e SERVER_NAME="Production" \
  --name backend \
  backend
```

### Отличие Project2 от TU 
#### 1) В Project2 мы тупо кидаем в /usr/share/nginx/html;  наш фронтенд , а в TU мы присоединяем как кластер фронтенд 
#### 2) Project2 - gitlab vs github actions - TU
#### 3) системы мониторинга в планах Zabbix Project2 vs ELK - TU
#### 4) Ну и также разница в серверах на данный момент 11.08.25 ( 1 против 4 ) 

### Важный момент также кодируем ssh ключ через base64 ( потому что с пробелами не принимает gitlab ci ) или без маски принимает, но так не безопасно


### Разивитие проектов
#### 1) Добавление системы мониторинга в обоих 
#### 2) Добавить в TU + бд + backend 
#### 3) также развернуть все через k8s 
#### 4) сделать хорошую безопасноть ( разными способами)
#### 5) скрипты для упрощение добавить 
#### 6) добавить ci/cd для backend Project2 
#### 7) сделать нормально nginx ( типо не только nginx.conf и все в одной,  а nginx.conf + /etc/nginx/conf.d/<имя>.conf



### счастливое число )
<img width="2292" height="230" alt="image" src="https://github.com/user-attachments/assets/250c89ba-be7a-40bb-b4ba-499d32f7477e" />


