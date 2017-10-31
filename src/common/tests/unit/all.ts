import has, { add } from '@dojo/has/has';

add('touch', () => {
	/* Since jsdom will fake it anyways, no problem pretending we can do touch in NodeJS */
	return Boolean('ontouchstart' in window || has('host-node'));
});

import '@dojo/test-extras/support/loadJsdom';
import './util';
import '../../../accordionpane/tests/unit/AccordionPane';
import '../../../button/tests/unit/Button';
import '../../../calendar/tests/unit/Calendar';
import '../../../calendar/tests/unit/CalendarCell';
import '../../../calendar/tests/unit/DatePicker';
import '../../../checkbox/tests/unit/Checkbox';
import '../../../combobox/tests/unit/ComboBox';
import '../../../combobox/tests/unit/ResultItem';
import '../../../combobox/tests/unit/ResultMenu';
import '../../../dialog/tests/unit/Dialog';
import '../../../label/tests/unit/Label';
import '../../../label/tests/unit/Label';
import '../../../radio/tests/unit/Radio';
import '../../../select/tests/unit/Select';
import '../../../select/tests/unit/SelectOption';
import '../../../slidepane/tests/unit/SlidePane';
import '../../../slider/tests/unit/Slider';
import '../../../splitpane/tests/unit/SplitPane';
import '../../../tabcontroller/tests/unit/Tab';
import '../../../tabcontroller/tests/unit/TabButton';
import '../../../tabcontroller/tests/unit/TabController';
import '../../../textarea/tests/unit/Textarea';
import '../../../textinput/tests/unit/TextInput';
import '../../../timepicker/tests/unit/TimePicker';
import '../../../titlepane/tests/unit/TitlePane';
