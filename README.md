##Git Setup

git init  
touch README  
git add README  
git commit -m 'first commit'  
git remote add origin https://github.com/Bretto/dewmap-blog.git  
git push -u origin master  


  
##Heroky Setup
<https://devcenter.heroku.com/articles/nodejs>
heroku login  

###include
	
	.gitignore   
	package.json  
	Procfile  
	web.js   

npm install 

####Run app localy
<https://github.com/alexch/rerun>  
rerun foreman start  
ctrl c to stop
test: http://localhost:5000/

###Deploy to Github
git add .  
git gui
git commit -m "init"  
git push origin master

###Deploy to Heroku
heroku create  
git push heroku master    
heroku ps:scale web=1  
heroku logs    
heroku config:add NODE_ENV=production  
heroku addons:add mongolab:starter  
heroku ps  
heroku restart  
heroku open   

##Implement Compass
compass create  
compass watch

##Start MongoDB localy
<http://www.mongodb.org/display/DOCS/Overview+-+The+MongoDB+Interactive+Shell>
mongod --dbpath=Sites/mongodb  
mongo in the shell: mongo  

	show dbs	 displays all the databases on the server you are connected to
	use db_name	 switches to db_name on the same server
	show collections	 displays a list of all the collections in the current database
	
##Mongodb Node Native Driver
<http://mongodb.github.com/node-mongodb-native/api-generated/>

##Resources
<http://vimeo.com/38136668>	
