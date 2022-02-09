function checkUser(){
  if(!localStorage.getItem('user')) {
    window.location.pathname = "/home.html"
  }
}
