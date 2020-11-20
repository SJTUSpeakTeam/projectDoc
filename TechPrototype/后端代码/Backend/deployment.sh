#!/bin/bash
BACK_END_VERSION="$1"
REPO_NAME="10.0.0.12:5000"

echo "[INFO] Logs: Start creating log"
Log="deployment.log"
LogLoc="$PWD"
LogPath="${LogLoc}/${Log}"
touch ${LogPath}

echo "[INFO] Git: following repo"
git add . >> ${LogPath} 2>&1
git commit
git pull
git push >> ${LogPath} 2>&1
git checkout release >> ${LogPath} 2>&1

echo '[INFO] Maven: package jar'
rm -r -f target
sed -i "s/localhost:3306/mysql.mysql:3306/g" ./src/main/resources/application.properties
sed -i "s/localhost:27017/mongo-2.mongo.mongo.svc.cluster.local:27017/g" ./src/main/resources/application.properties
mvn package >> ${LogPath} 2>&1
sed -i "s/mysql.mysql:3306/localhost:3306/g" ./src/main/resources/application.properties
sed -i "s/mongo-2.mongo.mongo.svc.cluster.local:27017/localhost:27017/g" ./src/main/resources/application.properties

echo '[INFO] Docker: create image'
docker build -t $REPO_NAME/syh-back-end:$BACK_END_VERSION . >> ${LogPath} 2>&1
docker ps >> ${LogPath} 2>&1

echo '[INFO] Docker: deploy image'
docker rm -f syh-back-end >> ${LogPath} 2>&1
docker run -d --name syh-back-end --network host $REPO_NAME/syh-back-end:$BACK_END_VERSION >> ${LogPath} 2>&1

echo '[INFO] Docker: upload image'
#IMAGE_NAME= "$(docker images | grep syh | awk '{print $3}')"
docker push $REPO_NAME/syh-back-end:$BACK_END_VERSION >> ${LogPath} 2>&1

echo '[INFO] Kubernetes: deploy services'
cd ../cluster-setup
./deployment.sh "${BACK_END_VERSION}"
cd ../back-end

echo '[INFO] Kubernetes: Force Update'
kubectl delete pod $(kubectl get pod | grep meta | awk '{print $1}') >> ${LogPath} 2>&1

echo "[INFO] Finish: All done! Logs at: ${LogPath}"
