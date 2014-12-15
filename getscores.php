<?php
header('Access-Control-Allow-Origin: *');




$host="www.sql5.freesqldatabase.com"; // Host name 
$username="sql561406"; // Mysql username 
$password="zT2%dY5*"; // Mysql password 
$db_name="sql561406"; // Database name 
$tbl_name="scores"; // Table name

// Connect to server and select database.
mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
mysql_select_db("$db_name")or die("cannot select DB");

// Retrieve data from database 
$sql="SELECT * FROM scores ORDER BY score DESC LIMIT 10";
$result=mysql_query($sql);

// Start looping rows in mysql database.
while($rows=mysql_fetch_array($result)){
echo $rows['name'] . "|" . $rows['score'] . "|";

// close while loop 
}

// close MySQL connection 
mysql_close();
?>