# PHP AJAX Complete CRUD Application with Image Upload

### ****Creating the Database Table****

Create a table named *ajax_crud* inside your MySQL database using the following code.

```sql
CREATE TABLE `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
)
```

### ****Copy files to htdocs folder****

Download the above files. Create a folder named *AJAX-CRUD* (you can name it anything you want) inside *htdocs* folder in *xampp* directory. Now, copy the downloaded files inside *AJAX-CRUD* folder. Finally, visit [localhost/AJAX-CRUD](http://localhost/AJAX-CRUD) in your browser and you should see the application.
