class Auth {
  constructor() {
    this.authenticated = true;
    this.role = "guest";
    this.userId = [];
  }

  userLogin(user_id) {
    this.authenticated = true;
    this.role = "user";
    this.userId = user_id;
  }

  adminLogin(user_id) {
    this.authenticated = true;
    this.role = "admin";
  }
  logout() {
    this.authenticated = false;
  }

  isAuthenticated() {
    return this.authenticated;
  }

  isAdmin() {
    if (this.role == "admin") {
      return true;
    }
    return false;
  }
  isUser() {
    if (this.role == "user") {
      return true;
    }
    return false;
  }
  isGuest() {
    if (this.role == "guest") {
      return true;
    }
    return false;
  }

  userName() {
    return this.userId.first_name + " " + this.userId.last_name;
  }
}

export default new Auth();
