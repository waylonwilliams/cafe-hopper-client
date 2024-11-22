// I use this function when passing parameters over expo navigation
// For some reason everything is assumed to be type string | string[] but i just want to pass strings

export default function assertString(v: string | string[] | undefined): string {
  if (v === undefined) {
    console.warn('Parameter is undefined, using default value');
    return '';
  }
  if (Array.isArray(v)) {
    console.warn('Parameter is array, joining with commas');
    return v.join(',');
  }
  return v;
}
