
#PRODUCTION
git reset --hard
git pull origin master
npm i
pm2 start proccess.config.js --env production

#DEVELOPMENT
# pm2 start proccess.config.js --env production
