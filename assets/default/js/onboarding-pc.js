        function pc(){
  var usercheck = localStorage.getItem('delete')
  if(usercheck == null){
      
    window.location.href = "/onboarding/pc";
    localStorage.setItem("delete", "userforfirst")
  }
  else if(usercheck != null){
   
  }
}
