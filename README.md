##Git Setup

git init  
touch README  
git add README  
git commit -m 'first commit'  
git remote add origin https://github.com/Bretto/dewmap-blog.git  
git push -u origin master  


  
##Heroky Setup

heroku login  

###include
	
	.gitignore   
	package.json  
	Procfile  
	web.js   

npm install 

####Run app localy
foreman start  
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