const mockData = [
	{
		id: 1,
		first_name: 'Timmi',
		last_name: 'Pury',
		job: 'Pharmacist',
		gender: 'Female',
		animal: 'Black and white colobus'
	},
	{
		id: 2,
		first_name: 'Donica',
		last_name: 'Novakovic',
		job: 'Safety Technician IV',
		gender: 'Female',
		animal: 'Southern screamer'
	},
	{
		id: 3,
		first_name: 'Julee',
		last_name: 'Jagiello',
		job: 'Nurse Practicioner',
		gender: 'Female',
		animal: 'Bear, black'
	},
	{
		id: 4,
		first_name: 'Gabie',
		last_name: 'Kirkby',
		job: 'Marketing Assistant',
		gender: 'Female',
		animal: 'Macaw, blue and gold'
	},
	{
		id: 5,
		first_name: 'Skylar',
		last_name: 'Novak',
		job: 'Editor',
		gender: 'Male',
		animal: 'African ground squirrel (unidentified)'
	},
	{
		id: 6,
		first_name: 'Bernardina',
		last_name: 'Fulford',
		job: 'Assistant Professor',
		gender: 'Female',
		animal: 'Hawk-headed parrot'
	},
	{
		id: 7,
		first_name: 'Lalo',
		last_name: 'Golley',
		job: 'Statistician III',
		gender: 'Male',
		animal: 'Goose, cape barren'
	},
	{
		id: 8,
		first_name: 'Tory',
		last_name: 'Trewhitt',
		job: 'Electrical Engineer',
		gender: 'Female',
		animal: 'Galapagos tortoise'
	},
	{
		id: 9,
		first_name: 'Waldon',
		last_name: 'Hews',
		job: 'Technical Writer',
		gender: 'Male',
		animal: 'Yellow-necked spurfowl'
	},
	{
		id: 10,
		first_name: 'Irina',
		last_name: 'Suart',
		job: 'Cost Accountant',
		gender: 'Female',
		animal: 'Flightless cormorant'
	},
	{
		id: 11,
		first_name: 'Loren',
		last_name: 'Mingardo',
		job: 'VP Marketing',
		gender: 'Male',
		animal: 'Rhinoceros, black'
	},
	{
		id: 12,
		first_name: 'Saw',
		last_name: 'Tarbett',
		job: 'Legal Assistant',
		gender: 'Male',
		animal: 'Mountain duck'
	},
	{
		id: 13,
		first_name: 'Willy',
		last_name: 'Treace',
		job: 'Mechanical Systems Engineer',
		gender: 'Female',
		animal: 'Lion, south american sea'
	},
	{
		id: 14,
		first_name: 'Hadley',
		last_name: 'Geldeford',
		job: 'Sales Associate',
		gender: 'Male',
		animal: 'Brown pelican'
	},
	{
		id: 15,
		first_name: 'Oliver',
		last_name: 'Topping',
		job: 'Sales Representative',
		gender: 'Male',
		animal: 'Mudskipper (unidentified)'
	},
	{
		id: 16,
		first_name: 'Alfredo',
		last_name: 'Brumham',
		job: 'Budget/Accounting Analyst II',
		gender: 'Male',
		animal: 'Eagle, african fish'
	},
	{
		id: 17,
		first_name: 'Bobbette',
		last_name: 'Boaler',
		job: 'Software Engineer I',
		gender: 'Female',
		animal: 'Booby, masked'
	},
	{
		id: 18,
		first_name: 'Giffy',
		last_name: 'Naismith',
		job: 'Dental Hygienist',
		gender: 'Male',
		animal: 'Herring gull'
	},
	{
		id: 19,
		first_name: 'Bidget',
		last_name: 'Dimitrie',
		job: 'Registered Nurse',
		gender: 'Female',
		animal: 'Harbor seal'
	},
	{
		id: 20,
		first_name: 'Sutherland',
		last_name: 'Casserley',
		job: 'Accounting Assistant II',
		gender: 'Male',
		animal: 'Common ringtail'
	},
	{
		id: 21,
		first_name: 'Shannon',
		last_name: 'Drains',
		job: 'Chief Design Engineer',
		gender: 'Male',
		animal: 'Yellow-brown sungazer'
	},
	{
		id: 22,
		first_name: 'Jade',
		last_name: 'Welford',
		job: 'Paralegal',
		gender: 'Female',
		animal: 'Jacana, african'
	},
	{
		id: 23,
		first_name: 'Blakelee',
		last_name: 'Henriksson',
		job: 'Programmer I',
		gender: 'Female',
		animal: 'Wombat, southern hairy-nosed'
	},
	{
		id: 24,
		first_name: 'Darin',
		last_name: 'Keble',
		job: 'Graphic Designer',
		gender: 'Male',
		animal: 'Paca'
	},
	{
		id: 25,
		first_name: 'Faunie',
		last_name: 'Iorns',
		job: 'Statistician III',
		gender: 'Female',
		animal: "Nutcracker, clark's"
	},
	{
		id: 26,
		first_name: 'Kara-lynn',
		last_name: 'Daoust',
		job: 'Staff Scientist',
		gender: 'Female',
		animal: 'Crab-eating raccoon'
	},
	{
		id: 27,
		first_name: 'Kiley',
		last_name: 'Heggman',
		job: 'Human Resources Manager',
		gender: 'Male',
		animal: 'Snake, western patch-nosed'
	},
	{
		id: 28,
		first_name: 'Verina',
		last_name: 'Connah',
		job: 'Environmental Tech',
		gender: 'Female',
		animal: 'Manatee'
	},
	{
		id: 29,
		first_name: 'Elene',
		last_name: 'Fere',
		job: 'Dental Hygienist',
		gender: 'Female',
		animal: 'Marabou stork'
	},
	{
		id: 30,
		first_name: 'Huey',
		last_name: 'Hazeldene',
		job: 'Assistant Media Planner',
		gender: 'Male',
		animal: 'Porcupine, tree'
	},
	{
		id: 31,
		first_name: 'Enrique',
		last_name: 'Caroline',
		job: 'Administrative Assistant III',
		gender: 'Male',
		animal: 'Asian red fox'
	},
	{
		id: 32,
		first_name: 'Kerianne',
		last_name: 'Okeshott',
		job: 'Sales Associate',
		gender: 'Female',
		animal: 'Openbill, asian'
	},
	{
		id: 33,
		first_name: 'Darbee',
		last_name: 'Lavalde',
		job: 'Media Manager IV',
		gender: 'Male',
		animal: 'Carmine bee-eater'
	},
	{
		id: 34,
		first_name: 'Kaiser',
		last_name: 'McClay',
		job: 'Senior Editor',
		gender: 'Male',
		animal: 'Goose, egyptian'
	},
	{
		id: 35,
		first_name: 'Madonna',
		last_name: 'Dani',
		job: 'Data Coordiator',
		gender: 'Female',
		animal: 'African buffalo'
	},
	{
		id: 36,
		first_name: 'Rani',
		last_name: 'Deware',
		job: 'Actuary',
		gender: 'Female',
		animal: 'Yellow-rumped siskin'
	},
	{
		id: 37,
		first_name: 'Dorie',
		last_name: 'Benediktsson',
		job: 'Help Desk Technician',
		gender: 'Male',
		animal: 'Kangaroo, western grey'
	},
	{
		id: 38,
		first_name: 'Mortimer',
		last_name: 'Janouch',
		job: 'Cost Accountant',
		gender: 'Male',
		animal: 'Spoonbill, white'
	},
	{
		id: 39,
		first_name: 'Jemie',
		last_name: 'Habron',
		job: 'VP Marketing',
		gender: 'Female',
		animal: 'Trotter, lily'
	},
	{
		id: 40,
		first_name: 'Silvio',
		last_name: 'Bolding',
		job: 'Help Desk Operator',
		gender: 'Male',
		animal: 'Black-throated cardinal'
	},
	{
		id: 41,
		first_name: 'Tuesday',
		last_name: 'Braley',
		job: 'Junior Executive',
		gender: 'Female',
		animal: 'Burmese brown mountain tortoise'
	},
	{
		id: 42,
		first_name: 'Madeleine',
		last_name: 'Wetherhead',
		job: 'Health Coach I',
		gender: 'Female',
		animal: 'Coqui partridge'
	},
	{
		id: 43,
		first_name: 'Brodie',
		last_name: 'Ziehm',
		job: 'Accounting Assistant II',
		gender: 'Male',
		animal: 'Loris, slender'
	},
	{
		id: 44,
		first_name: 'Linnell',
		last_name: 'Tombleson',
		job: 'Dental Hygienist',
		gender: 'Female',
		animal: 'Laughing kookaburra'
	},
	{
		id: 45,
		first_name: 'Ofilia',
		last_name: 'Pohl',
		job: 'Computer Systems Analyst III',
		gender: 'Female',
		animal: 'Plover, three-banded'
	},
	{
		id: 46,
		first_name: 'Adelaide',
		last_name: 'Ormrod',
		job: 'Financial Analyst',
		gender: 'Female',
		animal: 'American buffalo'
	},
	{
		id: 47,
		first_name: 'Alene',
		last_name: 'Hofler',
		job: 'Web Developer I',
		gender: 'Female',
		animal: 'Ringtail'
	},
	{
		id: 48,
		first_name: 'Kimberly',
		last_name: 'Spear',
		job: 'Structural Engineer',
		gender: 'Female',
		animal: 'Phalarope, northern'
	},
	{
		id: 49,
		first_name: 'Nataniel',
		last_name: 'Rainforth',
		job: 'Payment Adjustment Coordinator',
		gender: 'Male',
		animal: 'Emerald green tree boa'
	},
	{
		id: 50,
		first_name: 'Adrea',
		last_name: 'Chinnick',
		job: 'Legal Assistant',
		gender: 'Female',
		animal: 'Egyptian goose'
	},
	{
		id: 51,
		first_name: 'Jaynell',
		last_name: 'Fernie',
		job: 'Automation Specialist IV',
		gender: 'Female',
		animal: "Gazelle, thomson's"
	},
	{
		id: 52,
		first_name: 'Sileas',
		last_name: 'Pelerin',
		job: 'Operator',
		gender: 'Female',
		animal: 'Crane, wattled'
	},
	{
		id: 53,
		first_name: 'Salomone',
		last_name: 'Howling',
		job: 'Account Coordinator',
		gender: 'Male',
		animal: "Hartebeest, coke's"
	},
	{
		id: 54,
		first_name: 'Maxwell',
		last_name: 'Fransemai',
		job: 'Social Worker',
		gender: 'Male',
		animal: 'Groundhog'
	},
	{
		id: 55,
		first_name: 'Christal',
		last_name: 'Caddock',
		job: 'Chief Design Engineer',
		gender: 'Female',
		animal: 'Black-throated butcher bird'
	},
	{
		id: 56,
		first_name: 'Sherlocke',
		last_name: 'Kaines',
		job: 'Human Resources Manager',
		gender: 'Male',
		animal: 'Snake, carpet'
	},
	{
		id: 57,
		first_name: 'Delila',
		last_name: 'Randleson',
		job: 'Business Systems Development Analyst',
		gender: 'Female',
		animal: 'Ibex'
	},
	{
		id: 58,
		first_name: 'Madelon',
		last_name: 'Muglestone',
		job: 'Accountant I',
		gender: 'Female',
		animal: 'Bat, asian false vampire'
	},
	{
		id: 59,
		first_name: 'Marnie',
		last_name: 'Connick',
		job: 'Graphic Designer',
		gender: 'Female',
		animal: 'Horned lark'
	},
	{
		id: 60,
		first_name: 'Papagena',
		last_name: 'Zolini',
		job: 'Executive Secretary',
		gender: 'Female',
		animal: 'Ornate rock dragon'
	},
	{
		id: 61,
		first_name: 'Fernando',
		last_name: 'Keson',
		job: 'Social Worker',
		gender: 'Male',
		animal: 'Wallaby, whip-tailed'
	},
	{
		id: 62,
		first_name: 'Cynthia',
		last_name: 'Golly',
		job: 'Professor',
		gender: 'Female',
		animal: 'African wild dog'
	},
	{
		id: 63,
		first_name: 'Lorens',
		last_name: 'Bowmen',
		job: 'Account Executive',
		gender: 'Male',
		animal: 'Brindled gnu'
	},
	{
		id: 64,
		first_name: 'Gifford',
		last_name: 'Leney',
		job: 'Help Desk Technician',
		gender: 'Male',
		animal: 'Armadillo, giant'
	},
	{
		id: 65,
		first_name: 'Celka',
		last_name: 'Benardet',
		job: 'VP Accounting',
		gender: 'Female',
		animal: "Clark's nutcracker"
	},
	{
		id: 66,
		first_name: 'Yettie',
		last_name: 'Petriello',
		job: 'Marketing Assistant',
		gender: 'Female',
		animal: 'Crow, american'
	},
	{
		id: 67,
		first_name: 'Gertrud',
		last_name: 'de Courcey',
		job: 'Tax Accountant',
		gender: 'Female',
		animal: 'Rhesus macaque'
	},
	{
		id: 68,
		first_name: 'Bethany',
		last_name: 'Keenlayside',
		job: 'Database Administrator IV',
		gender: 'Female',
		animal: 'Rat, arboral spiny'
	},
	{
		id: 69,
		first_name: 'Felicity',
		last_name: 'Robecon',
		job: 'Assistant Media Planner',
		gender: 'Female',
		animal: 'Gray rhea'
	},
	{
		id: 70,
		first_name: 'Sianna',
		last_name: 'Boness',
		job: 'Senior Developer',
		gender: 'Female',
		animal: 'Skunk, striped'
	},
	{
		id: 71,
		first_name: 'Lesley',
		last_name: 'Bessell',
		job: 'Executive Secretary',
		gender: 'Male',
		animal: 'Pronghorn'
	},
	{
		id: 72,
		first_name: 'Callie',
		last_name: 'Cammiemile',
		job: 'Community Outreach Specialist',
		gender: 'Female',
		animal: "Kirk's dik dik"
	},
	{
		id: 73,
		first_name: 'Reidar',
		last_name: 'Cockling',
		job: 'Nurse',
		gender: 'Male',
		animal: 'Carpet python'
	},
	{
		id: 74,
		first_name: 'Town',
		last_name: 'Lamacraft',
		job: 'Recruiting Manager',
		gender: 'Male',
		animal: 'African pied wagtail'
	},
	{
		id: 75,
		first_name: 'Creight',
		last_name: 'Probbings',
		job: 'Recruiter',
		gender: 'Male',
		animal: 'Phalarope, grey'
	},
	{
		id: 76,
		first_name: 'Shawnee',
		last_name: 'Iacovides',
		job: 'Systems Administrator II',
		gender: 'Female',
		animal: 'White-browed sparrow weaver'
	},
	{
		id: 77,
		first_name: 'Tonye',
		last_name: 'Minshull',
		job: 'Help Desk Technician',
		gender: 'Female',
		animal: 'African darter'
	},
	{
		id: 78,
		first_name: 'Sile',
		last_name: 'Marunchak',
		job: 'Web Developer III',
		gender: 'Female',
		animal: 'Frilled lizard'
	},
	{
		id: 79,
		first_name: 'Gabriell',
		last_name: 'Attrill',
		job: 'Community Outreach Specialist',
		gender: 'Female',
		animal: 'Shrike, common boubou'
	},
	{
		id: 80,
		first_name: 'Marlane',
		last_name: 'Ennever',
		job: 'Web Designer IV',
		gender: 'Female',
		animal: 'Ass, asiatic wild'
	},
	{
		id: 81,
		first_name: 'Nobe',
		last_name: 'Wreford',
		job: 'Budget/Accounting Analyst I',
		gender: 'Male',
		animal: 'Nyala'
	},
	{
		id: 82,
		first_name: 'Rolando',
		last_name: 'Reside',
		job: 'Analog Circuit Design manager',
		gender: 'Male',
		animal: 'Turtle, snake-necked'
	},
	{
		id: 83,
		first_name: 'Faith',
		last_name: 'Arnely',
		job: 'Speech Pathologist',
		gender: 'Female',
		animal: 'Chestnut weaver'
	},
	{
		id: 84,
		first_name: 'Rollin',
		last_name: 'Adriaan',
		job: 'Cost Accountant',
		gender: 'Male',
		animal: 'Sulfur-crested cockatoo'
	},
	{
		id: 85,
		first_name: 'Thurston',
		last_name: 'Duchan',
		job: 'Health Coach IV',
		gender: 'Male',
		animal: 'American beaver'
	},
	{
		id: 86,
		first_name: 'Catriona',
		last_name: 'Overnell',
		job: 'Director of Sales',
		gender: 'Female',
		animal: 'Alligator, american'
	},
	{
		id: 87,
		first_name: 'Royce',
		last_name: 'Chesshire',
		job: 'General Manager',
		gender: 'Male',
		animal: 'Gerenuk'
	},
	{
		id: 88,
		first_name: 'Didi',
		last_name: 'Risebrow',
		job: 'Programmer II',
		gender: 'Female',
		animal: "Swainson's francolin"
	},
	{
		id: 89,
		first_name: 'Bradford',
		last_name: 'Charette',
		job: 'Physical Therapy Assistant',
		gender: 'Male',
		animal: 'Gull, lava'
	},
	{
		id: 90,
		first_name: 'Rachael',
		last_name: 'Duell',
		job: 'Administrative Officer',
		gender: 'Female',
		animal: 'Malachite kingfisher'
	},
	{
		id: 91,
		first_name: 'Bernie',
		last_name: 'Tacker',
		job: 'Dental Hygienist',
		gender: 'Male',
		animal: 'Common brushtail possum'
	},
	{
		id: 92,
		first_name: 'Nilson',
		last_name: 'Burnand',
		job: 'Operator',
		gender: 'Male',
		animal: 'Rattlesnake, horned'
	},
	{
		id: 93,
		first_name: 'Constantia',
		last_name: 'Eggar',
		job: 'Analyst Programmer',
		gender: 'Female',
		animal: 'Kangaroo, red'
	},
	{
		id: 94,
		first_name: 'Althea',
		last_name: 'Royan',
		job: 'Engineer IV',
		gender: 'Female',
		animal: 'Kangaroo, red'
	},
	{
		id: 95,
		first_name: 'Elisha',
		last_name: 'Tungay',
		job: 'Graphic Designer',
		gender: 'Male',
		animal: 'Blue shark'
	},
	{
		id: 96,
		first_name: 'Frans',
		last_name: 'Kettridge',
		job: 'Clinical Specialist',
		gender: 'Male',
		animal: 'Lizard (unidentified)'
	},
	{
		id: 97,
		first_name: 'Waldemar',
		last_name: 'Jaskowicz',
		job: 'Director of Sales',
		gender: 'Male',
		animal: 'Porcupine, african'
	},
	{
		id: 98,
		first_name: 'Dagny',
		last_name: 'Gennerich',
		job: 'Accounting Assistant I',
		gender: 'Male',
		animal: 'Pintail, bahama'
	},
	{
		id: 99,
		first_name: 'Zak',
		last_name: 'Aumerle',
		job: 'Analog Circuit Design manager',
		gender: 'Male',
		animal: 'Darwin ground finch (unidentified)'
	},
	{
		id: 100,
		first_name: 'Jemima',
		last_name: 'Whetnell',
		job: 'Professor',
		gender: 'Female',
		animal: 'Phalarope, red'
	}
];

export function getMockData(pages: number = 1) {
	let data = [];
	for (let i = 1; i <= pages; i++) {
		data.push(...mockData.map((data, index) => ({ ...data, id: i * (index + 1) })));
	}
	return data;
}

export default mockData;
