import { RecobrosRoute } from './recobros-route';

export class RecobrosChildRoute extends RecobrosRoute {
  path: string;
  constructor(
    category: string,
    capability: string,
    icon: string,
    title: string,
    path: string
  ) {
    super(category, capability, icon, title);
    this.path = path;
  }
}
