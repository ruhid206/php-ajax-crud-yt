<?php
include "config/db_conn.php";

// function to fetch data
if ($_GET["action"] === "fetchData") {
  $sql = "SELECT * FROM users";
  $result = mysqli_query($conn, $sql);
  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }
  mysqli_close($conn);
  header('Content-Type: application/json');
  echo json_encode([
    "data" => $data
  ]);
}



// insert data to database
if ($_GET["action"] === "insertData") {
  if (!empty($_POST["first_name"]) && !empty($_POST["last_name"]) && !empty($_POST["email"]) && !empty($_POST["country"]) && !empty($_POST["gender"]) && $_FILES["image"]["size"] != 0) {
    $first_name = mysqli_real_escape_string($conn, $_POST["first_name"]);
    $last_name = mysqli_real_escape_string($conn, $_POST["last_name"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $country = mysqli_real_escape_string($conn, $_POST["country"]);
    $gender = mysqli_real_escape_string($conn, $_POST["gender"]);

    // rename the image before saving to database
    $original_name = $_FILES["image"]["name"];
    $new_name = uniqid() . time() . "." . pathinfo($original_name, PATHINFO_EXTENSION);
    move_uploaded_file($_FILES["image"]["tmp_name"], "uploads/" . $new_name);

    $sql = "INSERT INTO `users`(`id`, `first_name`, `last_name`, `email`, `image`, `country`, `gender`) VALUES (NULL,'$first_name','$last_name','$email','$new_name','$country','$gender')";

    if (mysqli_query($conn, $sql)) {
      echo json_encode([
        "statusCode" => 200,
        "message" => "Data inserted successfully 😀"
      ]);
    } else {
      echo json_encode([
        "statusCode" => 500,
        "message" => "Failed to insert data 😓"
      ]);
    }
  } else {
    echo json_encode([
      "statusCode" => 400,
      "message" => "Please fill all the required fields 🙏"
    ]);
  }
}



// fetch data of individual user for edit form
if ($_GET["action"] === "fetchSingle") {
  $id = $_POST["id"];
  $sql = "SELECT * FROM users WHERE `id`=$id";
  $result = mysqli_query($conn, $sql);
  if (mysqli_num_rows($result) > 0) {
    $data = mysqli_fetch_assoc($result);
    header("Content-Type: application/json");
    echo json_encode([
      "statusCode" => 200,
      "data" => $data
    ]);
  } else {
    echo json_encode([
      "statusCode" => 404,
      "message" => "No user found with this id 😓"
    ]);
  }
  mysqli_close($conn);
}



// function to update data
if ($_GET["action"] === "updateData") {
  if (!empty($_POST["first_name"]) && !empty($_POST["last_name"]) && !empty($_POST["email"]) && !empty($_POST["country"]) && !empty($_POST["gender"])) {
    $id = mysqli_real_escape_string($conn, $_POST["id"]);
    $first_name = mysqli_real_escape_string($conn, $_POST["first_name"]);
    $last_name = mysqli_real_escape_string($conn, $_POST["last_name"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $country = mysqli_real_escape_string($conn, $_POST["country"]);
    $gender = mysqli_real_escape_string($conn, $_POST["gender"]);

    if ($_FILES["image"]["size"] != 0) {
      // rename the image before saving to database
      $original_name = $_FILES["image"]["name"];
      $new_name = uniqid() . time() . "." . pathinfo($original_name, PATHINFO_EXTENSION);
      move_uploaded_file($_FILES["image"]["tmp_name"], "uploads/" . $new_name);
      // remove the old image from uploads directory
      unlink("uploads/" . $_POST["image_old"]);
    } else {
      $new_name = mysqli_real_escape_string($conn, $_POST["image_old"]);
    }
    $sql = "UPDATE `users` SET `first_name`='$first_name',`last_name`='$last_name',`email`='$email',`image`='$new_name',`country`='$country',`gender`='$gender' WHERE `id`=$id";
    if (mysqli_query($conn, $sql)) {
      echo json_encode([
        "statusCode" => 200,
        "message" => "Data updated successfully 😀"
      ]);
    } else {
      echo json_encode([
        "statusCode" => 500,
        "message" => "Failed to update data 😓"
      ]);
    }
    mysqli_close($conn);
  } else {
    echo json_encode([
      "statusCode" => 400,
      "message" => "Please fill all the required fields 🙏"
    ]);
  }
}



// function to delete data
if ($_GET["action"] === "deleteData") {
  $id = $_POST["id"];
  $delete_image = $_POST["delete_image"];

  $sql = "DELETE FROM users WHERE `id`=$id";

  if (mysqli_query($conn, $sql)) {
    // remove the image
    unlink("uploads/" . $delete_image);
    echo json_encode([
      "statusCode" => 200,
      "message" => "Data deleted successfully 😀"
    ]);
  } else {
    echo json_encode([
      "statusCode" => 500,
      "message" => "Failed to delete data 😓"
    ]);
  }
}
