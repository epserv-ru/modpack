export function TextFormatter(count: number, forms: { one: string, few: string, many: string, other?: string }) {
  const pluralRules = new Intl.PluralRules("ru-RU");
  const rule = pluralRules.select(count);
  return `${forms[rule as keyof typeof forms] ?? forms.many}`;
}