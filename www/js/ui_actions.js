$$(".task-done").on('click', function(){

  var target = $$(this).data("target");

  fw7.dialog.confirm(null, "Delete item?", function(){

    $$("#" + target).remove();
    fw7.toast.create({
        closeTimeout: 3000,
        closeButton: true,
        text: "Item Deleted",
    }).open();
  }, function(){
    console.log("aborted");
  });

});
