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

###Deploy
git add .  
$ git commit -m "init"