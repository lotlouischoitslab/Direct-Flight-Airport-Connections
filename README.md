# A-Team001 Direct-Flight Airport Connections
## Contributors:
- ### Louis Sungwoo Cho 
- ### Javi Cardenas
- ### Shriyan Shailesh Gosavi
- ### Yug Mittal

## Documentation:
**Step 1:** First you need to clone this repository to your local machine by entering the following command into your local terminal. </br>

        git clone https://github.com/lotlouischoitslab/Direct-Flight-Airport-Connections

**Step 2:** Then you need to install nodejs and nodemon into your local machine by running the following commands 

        npx install nodejs
        npm install nodemon
        npm install express
        npm install plotly
        npm install mysql
        
        
**Step 3:** You then have to go to the app.js and database.js and next to the 'user' variable, you need to input your MySQL username and in the 'password' variable, you need to input your MySQL password. Do not forget to add your local database name into the 'database' variable as well. 

        var con = mysql.createConnection({
            host: "localhost",
            user: "root", //This should be your MySQL server local username 
            password: "", //This should be your MySQL server local password 
            database: "" //This should be your MySQL server local database name
        });
