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
      scomCid: 'bafybeidx5halau22ytcmnat252g4xnuq3catwoxclypygui3aalcek2ty4'
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