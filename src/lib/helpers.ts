


const toCamelCase = (obj: Record<string, any>): Record<string, any> => {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = obj[key];
      return acc;
    }, {} as Record<string, any>);
};

const convert_phase_to_string = (phase: number): string => {
  switch(phase) {
    case 0:
      return "Menstrual";
    case 1:
      return "Follicular";
    case 2:
      return "Ovulation";
    case 3:
      return "Luteal";
    default:
      return "--";
  }
}
  
export { toCamelCase, convert_phase_to_string };