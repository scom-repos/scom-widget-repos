import { Module, customModule, Styles } from '@ijstech/components';
import { ScomWidgetRepos } from '@scom/scom-widget-repos';

@customModule
export default class Main extends Module {
  render() {
    return (
      <i-panel width="100%" height="100%">
        <i-scom-widget-repos
          isProject={true}
          prefix={'scom'}
          baseUrl=''
          transportEndpoint="http://localhost:8088"
          contractInfo={{
            "43113": {
              "Proxy": {
                "address": "0x83aaf000f0a09f860564e894535cc18f5a50f627"
              },
              "ProjectInfo": {
                "address": "0x00279b49242cc763A92B5c6a0b53FC9bC0D64590"
              },
              "AuditorInfo": {
                "address": "0x9dcA206470C3dfeaCde5398887801F30254aFeB8"
              },
              "AuditInfo": {
                "address": "0xA36da99d18f255062659e0F15Da77d3f64B6d755"
              },
              "Scom": {
                "address": "0xf5debAAcB2Df6854D16BFD51cC12E5c0C4a51Ba9"
              }
            }
          }}
        ></i-scom-widget-repos>
      </i-panel>
    )
  }
}