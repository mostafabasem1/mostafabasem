        function ios(){
  var usercheck = localStorage.getItem('delete')
  if(usercheck == null){
      
    window.location.href = "/onboarding/start";
    localStorage.setItem("delete", "userforfirst")
  }
  else if(usercheck != null){
   
  }
}
