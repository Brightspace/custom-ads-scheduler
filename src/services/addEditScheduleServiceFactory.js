import { AddEditScheduleDemoService } from './addEditScheduleDemoService';
import { AddEditScheduleService } from './addEditScheduleService';

export class AddEditScheduleServiceFactory {
	static getAddEditScheduleService() {
		if (window.demo) {
			return AddEditScheduleDemoService;
		}
		return AddEditScheduleService;
	}
}
