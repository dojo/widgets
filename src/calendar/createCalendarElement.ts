import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Calendar from './Calendar';

/**
 * Configures a Calendar web component
 */
export default function createCalendarElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-calendar',
		widgetConstructor: Calendar,
		attributes: [
			{
				attributeName: 'month',
				value: value => value ? parseInt(value, 10) : undefined
			},
			{
				attributeName: 'selecteddate',
				propertyName: 'selectedDate',
				value: value => value ? new Date(value) : undefined
			},
			{
				attributeName: 'year',
				value: value => value ? parseInt(value, 10) : undefined
			}
		],
		properties: [
			{ propertyName: 'labels' },
			{ propertyName: 'monthNames' },
			{ propertyName: 'weekdayNames' },
			{ propertyName: 'renderMonthLabel' },
			{ propertyName: 'renderWeekdayCell' }
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
			}
		]
	};
};
