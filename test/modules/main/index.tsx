import { Module, customModule, Styles } from '@ijstech/components';
import { ScomWidgetRepos } from '@scom/scom-widget-repos';

@customModule
export default class Main extends Module {
  private el: ScomWidgetRepos;

  init() {
    super.init();
    this.el.setData({
      isProject: true,
      prefix: 'scom',
      baseUrl: '',
      transportEndpoint: 'https://storage.decom.app',
      scomCid: 'bafybeigc6tp3yaaymlteebkdodx7hfobmlvc5fzssubrro4tpemeulpouy'
    });
  }

  render() {
    return (
      <i-panel width="100%" height="100%">
        <i-scom-widget-repos id="el"></i-scom-widget-repos>
      </i-panel>
    )
  }
}