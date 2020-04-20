export class RecobrosRoute {
  category: string;
  capability: string;
  icon: string;
  title: string;

  constructor(
    category: string,
    capability: string,
    icon: string,
    title: string
  ) {
    this.category = category;
    this.capability = capability;
    this.icon = icon;
    this.title = title;
  }
}
