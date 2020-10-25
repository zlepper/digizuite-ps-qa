export class Version {
  public readonly major: number;
  public readonly minor: number;
  public readonly patch: number;

  constructor(public readonly text: string) {
    const [, major, minor, patch] = /(\d+)\.(\d+)\.(\d+)/.exec(text)!;

    this.major = parseInt(major, 10);
    this.minor = parseInt(minor, 10);
    this.patch = parseInt(patch, 10);
  }

  public compare(other: Version): number {
    if (this.major < other.major) {
      return -1;
    }

    if (this.major > other.major) {
      return 1;
    }

    if (this.minor < other.minor) {
      return -1;
    }

    if (this.minor > other.minor) {
      return 1;
    }

    if (this.patch < other.patch) {
      return -1;
    }

    if (this.patch > other.patch) {
      return 1;
    }

    return 0;
  }

  public lessThan(other: Version): boolean {
    return this.compare(other) < 0;
  }

  public greaterThan(other: Version): boolean {
    return this.compare(other) > 0;
  }

  public equal(other: Version): boolean {
    return this.compare(other) === 0;
  }
}
