import { tsx } from "@dojo/framework/core/vdom";
import WidgetBase from "@dojo/framework/core/WidgetBase";

import TabController from "@dojo/widgets/tab-controller";
import Tab from "@dojo/widgets/tab";

export default class extends WidgetBase {
  private _activeIndex = 0;

  private _onRequestTabChange(index: number) {
    this._activeIndex = index;
    this.invalidate();
  }

  protected render() {
    return (
      <TabController
        activeIndex={this._activeIndex}
        onRequestTabChange={this._onRequestTabChange}
      >
        <Tab key="tab-one" disabled={true} label="Tab One">
          Hello Tab One
        </Tab>
        <Tab key="tab-two" label="Tab Two">
          Hello Tab Two
        </Tab>
        <Tab key="tab-three" disabled={true} label="Tab Three">
          Hello Tab Three
        </Tab>
        <Tab key="tab-four" label="Tab Four">
          Hello Tab Four
        </Tab>
      </TabController>
    );
  }
}
