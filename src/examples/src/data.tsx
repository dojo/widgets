import { ListOption } from '@dojo/widgets/list';

export interface Data {
	id: string;
	product: string;
	category: string;
	department: string;
	price: string;
	description: string;
	summary: string;
}

export const data: Data[] = [
	{
		id: '09e90971-9e34-4450-8af5-df33371d11af',
		product: 'Awesome Granite Bacon',
		category: 'Cheese',
		department: 'Baby',
		price: '625.00',
		description:
			'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
		summary: 'Awesome Granite Bacon / Cheese / Baby / $625.00'
	},
	{
		id: 'f106a6ce-d514-4cf3-bb74-41e08d541dcb',
		product: 'Handcrafted Plastic Sausages',
		category: 'Computer',
		department: 'Grocery',
		price: '706.00',
		description:
			'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
		summary: 'Handcrafted Plastic Sausages / Computer / Grocery / $706.00'
	},
	{
		id: '5f814c11-615b-4ec9-9b93-67dbb2d66823',
		product: 'Generic Rubber Chicken',
		category: 'Towels',
		department: 'Sports',
		price: '705.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Generic Rubber Chicken / Towels / Sports / $705.00'
	},
	{
		id: '2be4af15-0973-48b5-a034-2495f511f2ba',
		product: 'Small Plastic Chicken',
		category: 'Ball',
		department: 'Beauty',
		price: '43.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Small Plastic Chicken / Ball / Beauty / $43.00'
	},
	{
		id: 'a1835fcd-a723-47f5-9f83-d116a936512c',
		product: 'Handmade Granite Car',
		category: 'Gloves',
		department: 'Tools',
		price: '439.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Handmade Granite Car / Gloves / Tools / $439.00'
	},
	{
		id: 'd8766593-e49b-4726-86a1-c038a2778c88',
		product: 'Fantastic Soft Sausages',
		category: 'Keyboard',
		department: 'Electronics',
		price: '816.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Fantastic Soft Sausages / Keyboard / Electronics / $816.00'
	},
	{
		id: '13dd0c79-f0ff-44dc-a598-14c8b2535a7e',
		product: 'Handcrafted Soft Soap',
		category: 'Tuna',
		department: 'Health',
		price: '140.00',
		description:
			'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
		summary: 'Handcrafted Soft Soap / Tuna / Health / $140.00'
	},
	{
		id: 'a2d7ecd4-4a3a-4508-b7f5-99a274321877',
		product: 'Ergonomic Concrete Table',
		category: 'Shirt',
		department: 'Health',
		price: '803.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Ergonomic Concrete Table / Shirt / Health / $803.00'
	},
	{
		id: 'c2226fd7-47f0-4031-b6d3-d0f5f6ca51c9',
		product: 'Gorgeous Soft Chips',
		category: 'Bacon',
		department: 'Music',
		price: '283.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Gorgeous Soft Chips / Bacon / Music / $283.00'
	},
	{
		id: '811efad9-cee2-4649-bdac-2caa5626580b',
		product: 'Awesome Metal Table',
		category: 'Sausages',
		department: 'Toys',
		price: '832.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Awesome Metal Table / Sausages / Toys / $832.00'
	},
	{
		id: '707ea70a-5d09-46f9-ace3-29acaf3f11e1',
		product: 'Fantastic Rubber Chair',
		category: 'Keyboard',
		department: 'Games',
		price: '788.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Fantastic Rubber Chair / Keyboard / Games / $788.00'
	},
	{
		id: '9d5085e5-be3f-4be7-ba3b-3f157e142757',
		product: 'Sleek Granite Bike',
		category: 'Towels',
		department: 'Health',
		price: '163.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Sleek Granite Bike / Towels / Health / $163.00'
	},
	{
		id: 'a4f281bb-6b1f-4ea4-9556-a06ed68ee93c',
		product: 'Small Concrete Mouse',
		category: 'Gloves',
		department: 'Music',
		price: '138.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Small Concrete Mouse / Gloves / Music / $138.00'
	},
	{
		id: '3a77f516-b56e-4eae-8751-8d4b684e3b81',
		product: 'Handcrafted Metal Computer',
		category: 'Pants',
		department: 'Automotive',
		price: '275.00',
		description:
			'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
		summary: 'Handcrafted Metal Computer / Pants / Automotive / $275.00'
	},
	{
		id: '2b12ae49-7645-4022-b5bd-c7ee55fbd8dd',
		product: 'Sleek Steel Mouse',
		category: 'Pants',
		department: 'Industrial',
		price: '434.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Sleek Steel Mouse / Pants / Industrial / $434.00'
	},
	{
		id: '9fe14881-05a1-40ca-99e2-8f19927626a9',
		product: 'Generic Cotton Shoes',
		category: 'Mouse',
		department: 'Baby',
		price: '922.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Generic Cotton Shoes / Mouse / Baby / $922.00'
	},
	{
		id: 'a73b5894-86ca-446f-843d-60891d69b41a',
		product: 'Awesome Metal Pizza',
		category: 'Pants',
		department: 'Health',
		price: '666.00',
		description:
			'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
		summary: 'Awesome Metal Pizza / Pants / Health / $666.00'
	},
	{
		id: '5fed813c-2788-497d-b477-e65ef4f9e5c5',
		product: 'Generic Metal Towels',
		category: 'Table',
		department: 'Outdoors',
		price: '966.00',
		description:
			'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
		summary: 'Generic Metal Towels / Table / Outdoors / $966.00'
	},
	{
		id: 'bfae9901-4c4a-4dc1-8f0b-ac7c60c5976a',
		product: 'Refined Soft Pants',
		category: 'Car',
		department: 'Games',
		price: '30.00',
		description:
			'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
		summary: 'Refined Soft Pants / Car / Games / $30.00'
	},
	{
		id: '916b1f87-6966-4074-8379-d3d3598126ee',
		product: 'Licensed Wooden Computer',
		category: 'Bike',
		department: 'Movies',
		price: '130.00',
		description:
			'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
		summary: 'Licensed Wooden Computer / Bike / Movies / $130.00'
	},
	{
		id: '345805c0-0967-45b1-8827-340c6bfb0252',
		product: 'Incredible Cotton Soap',
		category: 'Cheese',
		department: 'Automotive',
		price: '202.00',
		description:
			'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
		summary: 'Incredible Cotton Soap / Cheese / Automotive / $202.00'
	},
	{
		id: '096ea07c-b0b7-4242-9030-6a03ee822b43',
		product: 'Intelligent Concrete Pants',
		category: 'Shirt',
		department: 'Shoes',
		price: '733.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Intelligent Concrete Pants / Shirt / Shoes / $733.00'
	},
	{
		id: 'b9a344d4-601d-4c71-90d6-09c8d2b0c462',
		product: 'Awesome Fresh Pizza',
		category: 'Cheese',
		department: 'Games',
		price: '213.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Awesome Fresh Pizza / Cheese / Games / $213.00'
	},
	{
		id: 'c8500f1d-806c-4475-a9df-e9da4f7ac315',
		product: 'Handcrafted Fresh Salad',
		category: 'Hat',
		department: 'Movies',
		price: '190.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Handcrafted Fresh Salad / Hat / Movies / $190.00'
	},
	{
		id: 'f794b1fd-4890-4f49-92e3-51bd5b1b076d',
		product: 'Awesome Fresh Bacon',
		category: 'Bike',
		department: 'Jewelery',
		price: '137.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Awesome Fresh Bacon / Bike / Jewelery / $137.00'
	},
	{
		id: '38ec3edd-c54e-42d1-a289-edca0b38939b',
		product: 'Handmade Plastic Mouse',
		category: 'Chips',
		department: 'Movies',
		price: '992.00',
		description:
			'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
		summary: 'Handmade Plastic Mouse / Chips / Movies / $992.00'
	},
	{
		id: '0d6e836f-c29b-4d91-9c63-57fa2529963c',
		product: 'Small Frozen Ball',
		category: 'Shirt',
		department: 'Industrial',
		price: '386.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Small Frozen Ball / Shirt / Industrial / $386.00'
	},
	{
		id: '6c8dabf7-69d2-4c8b-b2b4-53e6235d0cbb',
		product: 'Ergonomic Soft Gloves',
		category: 'Cheese',
		department: 'Kids',
		price: '670.00',
		description:
			'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
		summary: 'Ergonomic Soft Gloves / Cheese / Kids / $670.00'
	},
	{
		id: '80fa58fb-882b-4749-ac12-72f5bc1fa1f1',
		product: 'Practical Rubber Table',
		category: 'Salad',
		department: 'Computers',
		price: '963.00',
		description:
			'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
		summary: 'Practical Rubber Table / Salad / Computers / $963.00'
	},
	{
		id: 'f0adec85-6701-4f9b-a30a-f491e62b3186',
		product: 'Intelligent Plastic Chips',
		category: 'Sausages',
		department: 'Jewelery',
		price: '957.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Intelligent Plastic Chips / Sausages / Jewelery / $957.00'
	},
	{
		id: '4c956494-b643-491b-86ac-e5889b061d5a',
		product: 'Ergonomic Cotton Bike',
		category: 'Chair',
		department: 'Music',
		price: '555.00',
		description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
		summary: 'Ergonomic Cotton Bike / Chair / Music / $555.00'
	},
	{
		id: '3a689e19-816a-479d-a331-a21a595cf1fd',
		product: 'Unbranded Fresh Bike',
		category: 'Pants',
		department: 'Grocery',
		price: '922.00',
		description:
			'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
		summary: 'Unbranded Fresh Bike / Pants / Grocery / $922.00'
	},
	{
		id: '3f64cc97-1722-4ad0-a1d6-7d63b2758b07',
		product: 'Practical Wooden Shoes',
		category: 'Table',
		department: 'Jewelery',
		price: '447.00',
		description:
			'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
		summary: 'Practical Wooden Shoes / Table / Jewelery / $447.00'
	},
	{
		id: '083795f8-8a8d-4c3a-8469-2dad705417e7',
		product: 'Handmade Rubber Table',
		category: 'Ball',
		department: 'Computers',
		price: '179.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Handmade Rubber Table / Ball / Computers / $179.00'
	},
	{
		id: '5d547ec5-3dd8-45d0-83f7-d6902f1e959c',
		product: 'Generic Metal Chair',
		category: 'Chair',
		department: 'Health',
		price: '265.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Generic Metal Chair / Chair / Health / $265.00'
	},
	{
		id: '20169baa-79f2-4ba5-9ac0-edd81b069368',
		product: 'Generic Soft Tuna',
		category: 'Fish',
		department: 'Movies',
		price: '32.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Generic Soft Tuna / Fish / Movies / $32.00'
	},
	{
		id: '865be68b-11d4-4ea1-9451-5152ef0cc356',
		product: 'Ergonomic Cotton Bike',
		category: 'Pizza',
		department: 'Music',
		price: '277.00',
		description:
			'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
		summary: 'Ergonomic Cotton Bike / Pizza / Music / $277.00'
	},
	{
		id: '97bbb876-a411-4e6a-928d-7747589056e0',
		product: 'Handcrafted Frozen Salad',
		category: 'Table',
		department: 'Kids',
		price: '904.00',
		description:
			'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
		summary: 'Handcrafted Frozen Salad / Table / Kids / $904.00'
	},
	{
		id: 'd0fb3af6-c465-45a7-8bd6-f9c3a3d8122a',
		product: 'Refined Soft Tuna',
		category: 'Chicken',
		department: 'Tools',
		price: '524.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Refined Soft Tuna / Chicken / Tools / $524.00'
	},
	{
		id: '9d8d04dc-a793-47e6-a1eb-c175b99e4b65',
		product: 'Awesome Plastic Fish',
		category: 'Bacon',
		department: 'Jewelery',
		price: '570.00',
		description:
			'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
		summary: 'Awesome Plastic Fish / Bacon / Jewelery / $570.00'
	},
	{
		id: '4543142e-7a93-4231-b01e-63b21c585367',
		product: 'Gorgeous Cotton Chicken',
		category: 'Keyboard',
		department: 'Grocery',
		price: '925.00',
		description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
		summary: 'Gorgeous Cotton Chicken / Keyboard / Grocery / $925.00'
	},
	{
		id: 'be8ea310-ab77-475a-ad5b-600b8e45411e',
		product: 'Practical Frozen Pizza',
		category: 'Pizza',
		department: 'Industrial',
		price: '815.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Practical Frozen Pizza / Pizza / Industrial / $815.00'
	},
	{
		id: '4151cdb5-53f1-4278-98c7-9e50f25aa4b2',
		product: 'Sleek Frozen Chicken',
		category: 'Chair',
		department: 'Home',
		price: '416.00',
		description:
			'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
		summary: 'Sleek Frozen Chicken / Chair / Home / $416.00'
	},
	{
		id: 'def84018-5dda-4b3d-9d17-3bd6b02683b4',
		product: 'Rustic Fresh Chicken',
		category: 'Ball',
		department: 'Health',
		price: '857.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Rustic Fresh Chicken / Ball / Health / $857.00'
	},
	{
		id: 'f7011bbe-379f-4bb2-b4f3-d68bbb170b02',
		product: 'Handcrafted Steel Keyboard',
		category: 'Shirt',
		department: 'Books',
		price: '517.00',
		description:
			'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
		summary: 'Handcrafted Steel Keyboard / Shirt / Books / $517.00'
	},
	{
		id: '1da802b8-f12d-4687-9d72-92a54b1da4e4',
		product: 'Licensed Frozen Hat',
		category: 'Tuna',
		department: 'Home',
		price: '711.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Licensed Frozen Hat / Tuna / Home / $711.00'
	},
	{
		id: 'b4a3d8e0-fb22-49a8-a2b3-592540b4a240',
		product: 'Handcrafted Soft Hat',
		category: 'Fish',
		department: 'Clothing',
		price: '892.00',
		description:
			'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
		summary: 'Handcrafted Soft Hat / Fish / Clothing / $892.00'
	},
	{
		id: 'b3587a6f-9773-4879-ba01-ab695d4046a8',
		product: 'Practical Frozen Tuna',
		category: 'Shoes',
		department: 'Toys',
		price: '684.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Practical Frozen Tuna / Shoes / Toys / $684.00'
	},
	{
		id: 'abc40c70-3753-48d0-8eaa-dc8cbabb8192',
		product: 'Tasty Metal Chips',
		category: 'Fish',
		department: 'Toys',
		price: '339.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Tasty Metal Chips / Fish / Toys / $339.00'
	},
	{
		id: 'f4874ba8-22a9-4329-afeb-ab9bb5781323',
		product: 'Refined Granite Bike',
		category: 'Pants',
		department: 'Baby',
		price: '521.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Refined Granite Bike / Pants / Baby / $521.00'
	},
	{
		id: '89bb3dac-dce7-4914-93d4-5ead460d7bab',
		product: 'Small Rubber Keyboard',
		category: 'Soap',
		department: 'Shoes',
		price: '394.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Small Rubber Keyboard / Soap / Shoes / $394.00'
	},
	{
		id: 'e23f03f2-be54-43ff-b5e3-7e79a0961fef',
		product: 'Gorgeous Metal Keyboard',
		category: 'Shoes',
		department: 'Electronics',
		price: '795.00',
		description:
			'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
		summary: 'Gorgeous Metal Keyboard / Shoes / Electronics / $795.00'
	},
	{
		id: '46263091-daff-4ab2-a33f-65a835828743',
		product: 'Small Granite Car',
		category: 'Tuna',
		department: 'Clothing',
		price: '554.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Small Granite Car / Tuna / Clothing / $554.00'
	},
	{
		id: '0f76a975-bd97-48d9-814d-55a7fa19096d',
		product: 'Refined Soft Soap',
		category: 'Sausages',
		department: 'Games',
		price: '179.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Refined Soft Soap / Sausages / Games / $179.00'
	},
	{
		id: '0d4c5b50-b2f6-41cb-a3da-ba9074ef6198',
		product: 'Practical Granite Bacon',
		category: 'Shirt',
		department: 'Garden',
		price: '128.00',
		description:
			'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
		summary: 'Practical Granite Bacon / Shirt / Garden / $128.00'
	},
	{
		id: 'de8a9dc3-6e7e-4150-b6f9-d4aee2bfe7d2',
		product: 'Unbranded Cotton Computer',
		category: 'Towels',
		department: 'Books',
		price: '877.00',
		description:
			'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
		summary: 'Unbranded Cotton Computer / Towels / Books / $877.00'
	},
	{
		id: 'dca170e6-b75b-4535-8339-8c9812c1f885',
		product: 'Awesome Fresh Keyboard',
		category: 'Salad',
		department: 'Toys',
		price: '716.00',
		description:
			'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
		summary: 'Awesome Fresh Keyboard / Salad / Toys / $716.00'
	},
	{
		id: 'da453419-54b2-4607-a733-2211d3ccd668',
		product: 'Handcrafted Soft Keyboard',
		category: 'Bacon',
		department: 'Baby',
		price: '287.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Handcrafted Soft Keyboard / Bacon / Baby / $287.00'
	},
	{
		id: '975928af-3192-473d-bcc2-45db5859facf',
		product: 'Rustic Plastic Shirt',
		category: 'Pizza',
		department: 'Home',
		price: '439.00',
		description:
			'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
		summary: 'Rustic Plastic Shirt / Pizza / Home / $439.00'
	},
	{
		id: '33de4d99-6ca7-4e4d-be31-862b0eaed206',
		product: 'Refined Cotton Pizza',
		category: 'Fish',
		department: 'Sports',
		price: '322.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Refined Cotton Pizza / Fish / Sports / $322.00'
	},
	{
		id: '68398931-02e4-4502-a542-6b3b48595416',
		product: 'Refined Fresh Keyboard',
		category: 'Pizza',
		department: 'Sports',
		price: '991.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Refined Fresh Keyboard / Pizza / Sports / $991.00'
	},
	{
		id: '4aff9404-8f16-48b6-8297-806fb83fd320',
		product: 'Tasty Granite Bacon',
		category: 'Mouse',
		department: 'Computers',
		price: '322.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Tasty Granite Bacon / Mouse / Computers / $322.00'
	},
	{
		id: 'ad62f282-d9ce-4f86-be50-aba328f004b7',
		product: 'Tasty Fresh Shoes',
		category: 'Keyboard',
		department: 'Clothing',
		price: '825.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Tasty Fresh Shoes / Keyboard / Clothing / $825.00'
	},
	{
		id: '0b528df6-03f1-4b89-ac27-ca5fb8da4227',
		product: 'Practical Plastic Chips',
		category: 'Shirt',
		department: 'Computers',
		price: '260.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Practical Plastic Chips / Shirt / Computers / $260.00'
	},
	{
		id: '4743e0f8-e8a8-4a54-bece-ce1598ed7d32',
		product: 'Rustic Soft Ball',
		category: 'Chicken',
		department: 'Sports',
		price: '919.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Rustic Soft Ball / Chicken / Sports / $919.00'
	},
	{
		id: 'e3d05e3c-17c4-4afb-bbbc-d93be6e945b1',
		product: 'Handmade Plastic Car',
		category: 'Sausages',
		department: 'Electronics',
		price: '29.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Handmade Plastic Car / Sausages / Electronics / $29.00'
	},
	{
		id: '66958cbe-672d-403b-a0bc-e2ebb7636c67',
		product: 'Generic Cotton Mouse',
		category: 'Mouse',
		department: 'Automotive',
		price: '370.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Generic Cotton Mouse / Mouse / Automotive / $370.00'
	},
	{
		id: 'c7e59045-84ba-400b-92db-cb40cab1c3ef',
		product: 'Intelligent Concrete Bike',
		category: 'Pants',
		department: 'Games',
		price: '521.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Intelligent Concrete Bike / Pants / Games / $521.00'
	},
	{
		id: '01842f1e-95ae-4bfe-8c60-210dd578c108',
		product: 'Awesome Frozen Soap',
		category: 'Chips',
		department: 'Baby',
		price: '783.00',
		description:
			'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
		summary: 'Awesome Frozen Soap / Chips / Baby / $783.00'
	},
	{
		id: '35ef42e6-3468-42f3-8e0c-fc979af761ab',
		product: 'Refined Soft Shoes',
		category: 'Car',
		department: 'Sports',
		price: '558.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Refined Soft Shoes / Car / Sports / $558.00'
	},
	{
		id: '1f29a11d-8b38-4cd4-9c87-66a9f2d6f378',
		product: 'Incredible Soft Computer',
		category: 'Bacon',
		department: 'Books',
		price: '957.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Incredible Soft Computer / Bacon / Books / $957.00'
	},
	{
		id: '267683af-9f68-4a4c-8b08-6fe1f5903b49',
		product: 'Generic Soft Towels',
		category: 'Shirt',
		department: 'Beauty',
		price: '656.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Generic Soft Towels / Shirt / Beauty / $656.00'
	},
	{
		id: '770b614e-ce44-4dca-81f8-80aec0628172',
		product: 'Refined Cotton Computer',
		category: 'Towels',
		department: 'Music',
		price: '671.00',
		description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
		summary: 'Refined Cotton Computer / Towels / Music / $671.00'
	},
	{
		id: '9acad2bf-9240-4f7c-ab1c-8188a1698cb9',
		product: 'Sleek Soft Chicken',
		category: 'Sausages',
		department: 'Garden',
		price: '778.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Sleek Soft Chicken / Sausages / Garden / $778.00'
	},
	{
		id: '2aaab651-9fb8-4505-aa7c-8e856960785d',
		product: 'Refined Cotton Shirt',
		category: 'Bike',
		department: 'Outdoors',
		price: '222.00',
		description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
		summary: 'Refined Cotton Shirt / Bike / Outdoors / $222.00'
	},
	{
		id: '00ae56d0-b268-4b3f-99f6-e0565fb3b48b',
		product: 'Small Cotton Cheese',
		category: 'Cheese',
		department: 'Clothing',
		price: '293.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Small Cotton Cheese / Cheese / Clothing / $293.00'
	},
	{
		id: '25b99703-339d-4b9a-a502-5d0bae77aa9e',
		product: 'Small Granite Mouse',
		category: 'Hat',
		department: 'Beauty',
		price: '454.00',
		description:
			'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
		summary: 'Small Granite Mouse / Hat / Beauty / $454.00'
	},
	{
		id: '662f83c8-f3ad-481a-8502-a7395b7b1d4a',
		product: 'Licensed Fresh Chair',
		category: 'Bacon',
		department: 'Outdoors',
		price: '4.00',
		description:
			'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
		summary: 'Licensed Fresh Chair / Bacon / Outdoors / $4.00'
	},
	{
		id: 'cff23cb8-47bb-401c-b2a5-8ea5a35cd2cf',
		product: 'Unbranded Concrete Computer',
		category: 'Ball',
		department: 'Tools',
		price: '940.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Unbranded Concrete Computer / Ball / Tools / $940.00'
	},
	{
		id: '9f726027-30f0-4d4d-ba33-ee474e490023',
		product: 'Handmade Granite Chips',
		category: 'Pizza',
		department: 'Baby',
		price: '516.00',
		description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
		summary: 'Handmade Granite Chips / Pizza / Baby / $516.00'
	},
	{
		id: '479af14c-6851-47ea-ad29-3850b3cac55b',
		product: 'Incredible Fresh Hat',
		category: 'Pizza',
		department: 'Computers',
		price: '490.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Incredible Fresh Hat / Pizza / Computers / $490.00'
	},
	{
		id: '02e1cca4-3229-47d9-b53c-1d6252db6c47',
		product: 'Sleek Wooden Computer',
		category: 'Hat',
		department: 'Beauty',
		price: '220.00',
		description:
			'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
		summary: 'Sleek Wooden Computer / Hat / Beauty / $220.00'
	},
	{
		id: '91e4513b-3cf3-45cc-80da-534d2e774e16',
		product: 'Small Cotton Gloves',
		category: 'Fish',
		department: 'Jewelery',
		price: '879.00',
		description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
		summary: 'Small Cotton Gloves / Fish / Jewelery / $879.00'
	},
	{
		id: 'ae6b1484-8ab1-4e43-8097-bceaff0c8423',
		product: 'Small Plastic Towels',
		category: 'Gloves',
		department: 'Kids',
		price: '382.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Small Plastic Towels / Gloves / Kids / $382.00'
	},
	{
		id: 'be1b4053-7a0b-4dd4-9fc3-ffa8ffa8f8ac',
		product: 'Fantastic Wooden Pants',
		category: 'Bike',
		department: 'Computers',
		price: '432.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Fantastic Wooden Pants / Bike / Computers / $432.00'
	},
	{
		id: 'f891a0e3-b129-4a01-81f8-329ebd994f9c',
		product: 'Generic Frozen Table',
		category: 'Towels',
		department: 'Garden',
		price: '539.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Generic Frozen Table / Towels / Garden / $539.00'
	},
	{
		id: '5cf23dec-9597-4d91-a62e-41c327ed91c7',
		product: 'Licensed Cotton Computer',
		category: 'Pizza',
		department: 'Toys',
		price: '164.00',
		description:
			'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
		summary: 'Licensed Cotton Computer / Pizza / Toys / $164.00'
	},
	{
		id: 'e49615d9-aa06-4911-a1ca-61bcf71a412a',
		product: 'Rustic Steel Table',
		category: 'Mouse',
		department: 'Industrial',
		price: '977.00',
		description:
			'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
		summary: 'Rustic Steel Table / Mouse / Industrial / $977.00'
	},
	{
		id: '13c31ab3-7680-4746-9326-cd8968530b4d',
		product: 'Intelligent Metal Salad',
		category: 'Computer',
		department: 'Baby',
		price: '79.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Intelligent Metal Salad / Computer / Baby / $79.00'
	},
	{
		id: 'a85d3006-3311-4719-917d-1d1cec82cf69',
		product: 'Ergonomic Plastic Chips',
		category: 'Tuna',
		department: 'Health',
		price: '261.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Ergonomic Plastic Chips / Tuna / Health / $261.00'
	},
	{
		id: 'bfdd88e4-8e55-4dea-a6a9-0d12e7bc183a',
		product: 'Ergonomic Granite Salad',
		category: 'Sausages',
		department: 'Outdoors',
		price: '405.00',
		description:
			'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
		summary: 'Ergonomic Granite Salad / Sausages / Outdoors / $405.00'
	},
	{
		id: '3d506f5e-522f-4152-83ad-0636542d182b',
		product: 'Fantastic Cotton Pizza',
		category: 'Gloves',
		department: 'Beauty',
		price: '383.00',
		description:
			'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
		summary: 'Fantastic Cotton Pizza / Gloves / Beauty / $383.00'
	},
	{
		id: '9dd54a7b-c76a-4292-a361-d9f4315007e3',
		product: 'Rustic Concrete Mouse',
		category: 'Tuna',
		department: 'Books',
		price: '274.00',
		description:
			'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
		summary: 'Rustic Concrete Mouse / Tuna / Books / $274.00'
	},
	{
		id: '1e5d4d7f-509f-40d3-9ab2-caed1831dc1f',
		product: 'Practical Metal Pizza',
		category: 'Chair',
		department: 'Beauty',
		price: '83.00',
		description:
			'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
		summary: 'Practical Metal Pizza / Chair / Beauty / $83.00'
	},
	{
		id: '4fe6c6e5-b569-435c-be1a-01768ff260eb',
		product: 'Ergonomic Cotton Computer',
		category: 'Gloves',
		department: 'Jewelery',
		price: '44.00',
		description: 'The Football Is Good For Training And Recreational Purposes',
		summary: 'Ergonomic Cotton Computer / Gloves / Jewelery / $44.00'
	},
	{
		id: '321a32af-b494-4ae3-85b8-ca016b42fb3a',
		product: 'Awesome Plastic Fish',
		category: 'Keyboard',
		department: 'Health',
		price: '327.00',
		description:
			'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
		summary: 'Awesome Plastic Fish / Keyboard / Health / $327.00'
	},
	{
		id: '680badd3-ff8b-47c1-8c82-4b0642dcb6ea',
		product: 'Refined Frozen Gloves',
		category: 'Bacon',
		department: 'Music',
		price: '926.00',
		description:
			'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
		summary: 'Refined Frozen Gloves / Bacon / Music / $926.00'
	},
	{
		id: '2b1a15d4-7b28-4d1d-96cb-aeb98a545507',
		product: 'Unbranded Concrete Tuna',
		category: 'Shirt',
		department: 'Outdoors',
		price: '275.00',
		description:
			'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
		summary: 'Unbranded Concrete Tuna / Shirt / Outdoors / $275.00'
	},
	{
		id: '2a9ea674-abbb-40fd-a0a9-5dd8d2f2a1f3',
		product: 'Rustic Fresh Pants',
		category: 'Chips',
		department: 'Beauty',
		price: '197.00',
		description:
			"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
		summary: 'Rustic Fresh Pants / Chips / Beauty / $197.00'
	},
	{
		id: 'bac4f2a9-15ad-4e90-a08e-691ab24c2cfa',
		product: 'Gorgeous Concrete Shoes',
		category: 'Fish',
		department: 'Home',
		price: '592.00',
		description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
		summary: 'Gorgeous Concrete Shoes / Fish / Home / $592.00'
	}
];

export const listOptions: ListOption[] = data.map((item) => ({
	value: item.id,
	label: item.summary
}));
