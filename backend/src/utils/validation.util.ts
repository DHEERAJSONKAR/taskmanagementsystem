export class ValidationUtil {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    // At least 6 characters
    return password.length >= 6;
  }

  static isValidName(name: string): boolean {
    return name.trim().length >= 2;
  }

  static isValidTitle(title: string): boolean {
    return title.trim().length >= 1;
  }
}
