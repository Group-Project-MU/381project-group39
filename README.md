## Project info
Project name: Database of missing people<br>
group no: 39<br>
students' name:<br>
Yeung Lok Ki 13004546<br>
Zhou Ruijin 13032809<br>
Gurung Priyanka 13078953<br>
Wong Po Wan 13048414<br>
### Background
When someone goes missing, we usually post the news to all major social media, which cause the information become scattered. So we design to create a central platform where information could be centralized.<p>
## Project file intro
### server.js<br>
1. User Authentication: The application provides secure user authentication, 
including registration, login, and password recovery.
2. CRUD & RESTful CRUD Operations: <br>
Create: User can create a request and leave a message.<br>
Read: View the list of missing people and their details.<br>
Update: Edit the request that the user created.<br>
Delete: Remove the request that the person was found or created incorrectly.<p>
### package.json<br>
cookie-session (\^2.1.0),<br>
ejs (\^3.1.10), express (\^4.21.1),<br>
express-fileupload (\^1.5.1),<br>
express-formidable (\^1.2.0),<br>
formidable (\^3.5.2),<br> 
leaflet (\^1.9.4),<br> 
mongoose(\^8.4.3)<p>
### public<br>
*CSS folder:<br>
Includes delete.css, detail.css, edit.css, login.css, profile.css,
request.css, search.css and viewmap.css. <br>
*Image folder:<br>
Includes excalm.png, question.png and UnknowUser.jpeg.
### views<br>
Includes CreateRequest.ejs, delete.ejs, detail.ejs, login.ejs,
map.ejs, profile.ejs, register.ejs and search.ejs.<br>
Some of the ejs files provide some front-end checking, search function and 
display error messages.<p>
1.Search and Filter: The application allows users to search and filter data based 
on name and postcode to quickly find relevant information. *Postcode (which 
user created in request for quickly access to the details page without login)<br>
2. Error notifications: The user will receive an error message if their accounts do 
not exist, the password is incorrect or something else.<p>
### models<br>
Includes account.js and request.js.
## Cloud-based Server URL:
### https://381project-group39.azurewebsites.net/
## Operation Guides:<br>
### Guest functions:
1. Create request as guest. (check the username in create request page)
2. View the map
3. Search and Read details
### User with account:
1. Create request as user. (check the username in create request page)
2. View the map.
3. Search and Read details
4. Post a message and location in the detail page
5. Delete and edit the user's own request.

*If you don’t want to sign up an account, just create requests as a guest but you 
cannot enjoy some of the services.<p>

### Login/Logout:
- Valid Login information:<br>
- Username: 'test01'<br>
- Password:'12345678'<p>

-Steps to login:
1. Head to the Homepage
2. Enter the username and password
3. Click the Login button
   
### Search page:
-Use the name or the postcode to search the request.<p>
### Details page:<br>
-View the request details and can post a message.<br> 
-Clicking on the symbol which shows on the map to display the message.<p>
### Profile:
-Display the request(s) that the user created.<br>
-Delete and edit only exist when user created a request.<p>
### View Map:
-The first mark appeared in the map is the latest request that someone was created.<br>
-You can also view other requests on the map.<p>
### Create request:
-Provided some front-end checking, the postcode, name, age, contact number and location must not be empty.<br>
-Duplicated postcode is not allowed, an error message will be pop out.<br>
-Name should not be a number and the length must be greater than or equal to 3.<br>
-The post button will be enable when you pass all the checking.<p>
### Edit:
-Click the edit button to edit the post.<br>
-Also provided some front-end checking, follow the above requirements.<p>
### Delete:
-Click the delete button to delete.<p>

### CRUD operations<br>
-Create: Details page, Signup page, and create request page.<br>
-Read: The view map page, search and details page.<br>
-Update: After logging in, a edit button will display in the profile page if the user has a request.<br>
-Delete: After logging in, a delete button will display in the profile page if the user has a request.<br>
### RESTful CRUD Services:<br>
### Create:
Format:<br>
curl -X POST -H "Content-Type: application/json" --data '{"name":"name", 
"num":"contact", "age":"age", "date":"date", "lat":"latitude", "lng":"longitude", 
"com": "some text"}' https://381project-group39.azurewebsites.net/api/postcode/your_postcode<p>
Example:<br>
curl -X POST -H "Content-Type: application/json" --data '{"name":"test", 
"num":"10000000", "age":"3", "date":"00:00 1/1/2023","lat":"22.31971350566492", 
"lng":"114.1742751002312", "com": "oldtext"}' https://381project-group39.azurewebsites.net/api/postcode/test123<br>
### Read:
format:<br>
curl -X GET  https://381project-group39.azurewebsites.net/api/postcode/your_postcode<p>
example:<br>
curl -X GET https://381project-group39.azurewebsites.net/api/postcode/test123<br>
### Update:
format:<br>
curl -X PUT -H "Content-Type: application/json" --data '{"name":"newname", 
"num":"newcontact", "age":"newage", "lat":"newlatitude", "lng":"newlongitude", 
"com": "newtext"}' https://381project-group39.azurewebsites.net/api/postcode/your_postcode<p>
example:<br>
curl -X PUT -H "Content-Type: application/json" --data '{"name":"test12345", 
"num":"31202589", "age":"5", "lat":"22.315956834256337", 
"lng":"114.17828500270844", "date":"00:00 1/1/2024", "com": "newtext"}' 
https://381project-group39.azurewebsites.net/api/postcode/test123<br>
### Delete:
Format:<br>
curl -X DELETE https://381project-group39.azurewebsites.net/api/postcode/your_postcode<p>
Example:<br>
curl -X DELETE https://381project-group39.azurewebsites.net/api/postcode/test123<p>
<br>

https://github.com/Group-Project-MU/381project-group39
