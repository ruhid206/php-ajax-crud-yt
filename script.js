$(document).ready(function() {
  // call fetchData function
  fetchData();


  //initialize datatables
  let table = new DataTable("#myTable");


  // function to display image before upload
  $("input.image").change(function() {
    var file = this.files[0];
    var url = URL.createObjectURL(file);
    $(this).closest(".row").find(".preview_img").attr("src", url);
  });


  // function to fetch data from database
  function fetchData() {
    $.ajax({
      url: "server.php?action=fetchData",
      type: "POST",
      dataType: "json",
      success: function(response) {
        var data = response.data;
        table.clear().draw();
        $.each(data, function(index, value) {
          table.row.add([
            value.id,
            value.first_name,
            value.last_name,
            '<img src="uploads/' + value.image + '" style="width:50px;height:50px;border:2px solid gray;border-radius:8px;object-fit:cover">',
            value.email,
            value.country,
            value.gender,
            '<Button type="button" class="btn editBtn" value="' + value.id + '"><i class="fa-solid fa-pen-to-square fa-xl"></i></Button>' +
            '<Button type="button" class="btn deleteBtn" value="' + value.id + '"><i class="fa-solid fa-trash fa-xl"></i></Button>' +
            '<input type="hidden" class="delete_image" value="' + value.image + '">'
          ]).draw(false);
        })
      }
    })
  }

  // function to insert data to database
  $("#insertForm").on("submit", function(e) {
    $("#insertBtn").attr("disabled", "disabled");
    e.preventDefault();
    $.ajax({
      url: "server.php?action=insertData",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(response) {
        var response = JSON.parse(response);
        if (response.statusCode == 200) {
          $("#offcanvasAddUser").offcanvas("hide");
          $("#insertBtn").removeAttr("disabled");
          $("#insertForm")[0].reset();
          $(".preview_img").attr("src", "images/default_profile.jpg");
          $("#successToast").toast("show");
          $("#successMsg").html(response.message);
          fetchData();
        } else if(response.statusCode == 500) {
          $("#offcanvasAddUser").offcanvas("hide");
          $("#insertBtn").removeAttr("disabled");
          $("#insertForm")[0].reset();
          $(".preview_img").attr("src", "images/default_profile.jpg");
          $("#errorToast").toast("show");
          $("#errorMsg").html(response.message);
        } else if(response.statusCode == 400) {
          $("#insertBtn").removeAttr("disabled");
          $("#errorToast").toast("show");
          $("#errorMsg").html(response.message);
        }
      }
    });
  });


  // function to edit data
  $("#myTable").on("click", ".editBtn", function() {
    var id = $(this).val();
    $.ajax({
      url: "server.php?action=fetchSingle",
      type: "POST",
      dataType: "json",
      data: {
        id: id
      },
      success: function(response) {
        var data = response.data;
        $("#editForm #id").val(data.id);
        $("#editForm input[name='first_name']").val(data.first_name);
        $("#editForm input[name='last_name']").val(data.last_name);
        $("#editForm input[name='email']").val(data.email);
        $("#editForm select[name='country']").val(data.country);
        $("#editForm .preview_img").attr("src", "uploads/" + data.image + "");
        $("#editForm #image_old").val(data.image);
        if (data.gender === "male") {
          $("#editForm input[name='gender'][value='male']").attr("checked", true);
        } else if(data.gender === "female") {
          $("#editForm input[name='gender'][value='female']").attr("checked", true);          
        }
        // show the edit user offcanvas
        $("#offcanvasEditUser").offcanvas("show");
      }
    });
  });



  // function to update data in database
  $("#editForm").on("submit", function(e) {
    $("#editBtn").attr("disabled", "disabled");
    e.preventDefault();
    $.ajax({
      url: "server.php?action=updateData",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(response) {
        var response = JSON.parse(response);
        if (response.statusCode == 200) {
          $("#offcanvasEditUser").offcanvas("hide");
          $("#editBtn").removeAttr("disabled");
          $("#editForm")[0].reset();
          $(".preview_img").attr("src", "images/default_profile.jpg");
          $("#successToast").toast("show");
          $("#successMsg").html(response.message);
          fetchData();
        } else if(response.statusCode == 500) {
          $("#offcanvasEditUser").offcanvas("hide");
          $("#editBtn").removeAttr("disabled");
          $("#editForm")[0].reset();
          $(".preview_img").attr("src", "images/default_profile.jpg");
          $("#errorToast").toast("show");
          $("#errorMsg").html(response.message);
        } else if(response.statusCode == 400) {
          $("#editBtn").removeAttr("disabled");
          $("#errorToast").toast("show");
          $("#errorMsg").html(response.message);
        }
      }
    });
  });



  // function to delete data
  $("#myTable").on("click", ".deleteBtn", function() {
    if(confirm("Are you sure you want to delete this user?")) {
      var id = $(this).val();
      var delete_image = $(this).closest("td").find(".delete_image").val();
      $.ajax({
        url: "server.php?action=deleteData",
        type: "POST",
        dataType: "json",
        data: {
          id,
          delete_image
        },
        success: function(response) {
          if(response.statusCode == 200) {
            fetchData();
            $("#successToast").toast("show");
            $("#successMsg").html(response.message);
          } else if(response.statusCode == 500) {
            $("#errorToast").toast("show");
            $("#errorMsg").html(response.message);
          }
        }
      })
    }
  })

});