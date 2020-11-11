export class AddEditScheduleDemoService {

	static async getAdvancedDataSets() {
		return [
			{
				DataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b1',
				Name: 'Data Set A',
				Description: 'This is a description of Advanced Data Set A',
				Category: 'AdvancedDataSets',
				Filters: [
					{
						'Name': 'userId',
						'Type': 4
					},
					{
						'Name': 'parentOrgUnitId',
						'Type': 2
					},
					{
						'Name': 'startDate',
						'Type': 1
					},
					{
						'Name': 'endDate',
						'Type': 1
					},
					{
						'Name': 'roles',
						'Type': 3
					}
				]
			},
			{
				DataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b2',
				Name: 'Data Set B',
				Description: 'This is a description of Advanced Data Set B',
				Category: 'AdvancedDataSets',
				Filters: [
					{
						'Name': 'parentOrgUnitId',
						'Type': 2
					},
					{
						'Name': 'startDate',
						'Type': 1
					},
					{
						'Name': 'endDate',
						'Type': 1
					},
					{
						'Name': 'roles',
						'Type': 3
					}
				]
			},
			{
				DataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b3',
				Name: 'Data Set C',
				Description: 'This is a description of Advanced Data Set C',
				Category: 'AdvancedDataSets',
				Filters: [
					{
						'Name': 'parentOrgUnitId',
						'Type': 2
					},
					{
						'Name': 'startDate',
						'Type': 1
					},
					{
						'Name': 'endDate',
						'Type': 1
					},
					{
						'Name': 'userId',
						'Type': 4
					}
				]
			},
			{
				DataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b4',
				Name: 'Data Set D',
				Description: 'This is a description of Advanced Data Set D',
				Category: 'AdvancedDataSets',
				Filters: [
					{
						'Name': 'userId',
						'Type': 4
					},
					{
						'Name': 'startDate',
						'Type': 1
					},
					{
						'Name': 'endDate',
						'Type': 1
					},
					{
						'Name': 'roles',
						'Type': 3
					}
				]
			}
		];
	}

	static async getRoles() {
		return [
			{
				'Identifier': '578',
				'DisplayName': 'End User',
				'Code': 'End User'
			},
			{
				'Identifier': '595',
				'DisplayName': 'Student',
				'Code': null
			},
			{
				'Identifier': '596',
				'DisplayName': 'Instructor',
				'Code': null
			},
			{
				'Identifier': '597',
				'DisplayName': 'D2LMonitor',
				'Code': null
			},
			{
				'Identifier': '579',
				'DisplayName': 'Resource Creator',
				'Code': null
			},
			{
				'Identifier': '580',
				'DisplayName': 'Administrator',
				'Code': null
			},
			{
				'Identifier': '581',
				'DisplayName': 'Blank Role',
				'Code': null
			},
			{
				'Identifier': '582',
				'DisplayName': 'Blank Role 2',
				'Code': null
			},
			{
				'Identifier': '583',
				'DisplayName': 'Admin (co)',
				'Code': null
			},
			{
				'Identifier': '952',
				'DisplayName': 'SIS Integration',
				'Code': null
			},
			{
				'Identifier': '953',
				'DisplayName': 'AllSection AllGroup',
				'Code': null
			},
			{
				'Identifier': '11591',
				'DisplayName': 'IPSCT_Admin',
				'Code': null
			},
			{
				'Identifier': '11598',
				'DisplayName': 'IPSCT_Manage',
				'Code': null
			},
			{
				'Identifier': '11599',
				'DisplayName': 'IPSCT_Security',
				'Code': null
			},
			{
				'Identifier': '591',
				'DisplayName': 'LR Power User',
				'Code': null
			},
			{
				'Identifier': '954',
				'DisplayName': 'AllSection NoGroup',
				'Code': null
			}
		];
	}
}
