# MongoDB
## Comment installer `mongodb`
0. ouvrir un terminal dans le repertoire de `mean`
1. executer `curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.4.4.tgz`
2. executer `tar -zxvf mongodb-osx-x86_64-3.4.4.tgz`
3. executer `mkdir -p mongodb`
4. executer `cp -R -n mongodb-osx-x86_64-3.4.4/ mongodb`
5. executer `rm -rf mongodb-osx-x86_64-3.4.4`
6. executer `export PATH=mongodb/bin:$PATH`
7. executer `mkdir -p mongodb-data/db`

## Comment demarrer `mongodb`
1. ouvrir un terminal dans le repertoire de `mean`
2. executer `mongod --dbpath mongodb-data/db`
