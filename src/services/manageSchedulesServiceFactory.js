import { ManageSchedulesDemoService } from './manageSchedulesDemoService';
//import { ManageSchedulesService } from './manageSchedulesService';

export class ManageSchedulesServiceFactory {
	static getManageSchedulesService() {
		//if (window.demo) {
		return ManageSchedulesDemoService;
		//}
		//return ManageSchedulesService;
	}
}
