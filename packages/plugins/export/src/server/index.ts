import { InstallOptions, Plugin } from '@nocobase/server';
import { exportXlsx } from './actions';

export class ExportPlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  beforeLoad() {}

  async load() {
    this.app.resourcer.registerActionHandler('export', exportXlsx);
    this.app.acl.setAvailableAction('export', {
      displayName: '{{t("Export")}}',
      allowConfigureFields: true,
    });
  }

  async install(options: InstallOptions) {}
}

export default ExportPlugin;
