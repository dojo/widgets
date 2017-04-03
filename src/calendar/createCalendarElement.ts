import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Calendar from './Calendar';

/**
 * Configures a Calendar web component
 *
 * @return	{CustomElementDescriptor?}
 */
export default function createCalendarElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-calendar',
		widgetConstructor: Calendar,
		attributes: [],
		properties: [
			{
				propertyName: 'selectedDate'
			},
			{
				propertyName: 'focusedDate'
			},
			{
				propertyName: 'renderDateCell'
			}
		],
		events: [
			{
				propertyName: 'onMonthChange',
				eventName: 'monthchange'
			},
			{
				propertyName: 'onYearChange',
				eventName: 'yearchange'
			},
			{
				propertyName: 'onDateSelect',
				eventName: 'dateselect'
			},
			{
				propertyName: 'onYearSelect',
				eventName: 'yearselect'
			},
			{
				propertyName: 'onDateFocus',
				eventName: 'datefocus'
			}
		]
	};
};
