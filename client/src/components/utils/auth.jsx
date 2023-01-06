class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(email) {
    this.authenticated = true;
  }

  logout() {
    this.authenticated = false;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
