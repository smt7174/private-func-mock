export class ConvertUpper {
  constructor() {}
  public convert(str: string) {
    return this.convertToUpperCase(str);
  }

  private convertToUpperCase(str: string): string {
    return str.toUpperCase();
  }
}
