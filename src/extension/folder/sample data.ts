export const SAMPLE_DATA = [
	{
		title: "Sidebar",
		link: "https://redmine.acme.dev/projects/my-project-name/wiki/Sidebar",
	},
	{
		title: "Wiki",
		link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki",
	},
	{
		title: "Wiki1 DONT-EXIST-FROM-SAMPLE-DATA",
		link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1",
		children: [
			{
				title: "Wiki1-child1",
				link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child1",
				children: [
					{
						title: "Wiki1-child1-subchild1",
						link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child1-subchild1",
					},
					{
						title: "Wiki1-child1-subchild2",
						link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child1-subchild2",
						children: [
							{
								title: "New sub sub child",
								link: "https://redmine.acme.dev/projects/my-project-name/wiki/New_sub_sub_child",
							},
							{
								title: "Sub sub sub child",
								link: "https://redmine.acme.dev/projects/my-project-name/wiki/Sub_sub_sub_child",
								children: [
									{
										title: "Aaa",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaa",
										children: [
											{
												title: "Hahayes",
												link: "https://redmine.acme.dev/projects/my-project-name/wiki/Hahayes",
												children: [
													{
														title: "I am so happy",
														link: "https://redmine.acme.dev/projects/my-project-name/wiki/I_am_so_happy",
													},
												],
											},
										],
									},
									{
										title: "Aaaaa",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaaaa",
									},
									{
										title: "Aaab",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaab",
									},
									{
										title: "Aaabcc",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaabcc",
									},
									{
										title: "Fdafasdas",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Fdafasdas",
									},
								],
							},
						],
					},
				],
			},
			{
				title: "Wiki1-child2",
				link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child2",
			},
		],
	},
	{
		title: "Wiki1 DONT-EXIST-FROM-SAMPLE-DATA",
		link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1",
		children: [
			{
				title: "Wiki1-child1",
				link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child1",
				children: [
					{
						title: "Wiki1-child1-subchild1",
						link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child1-subchild1",
					},
					{
						title: "Wiki1-child1-subchild2",
						link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child1-subchild2",
						children: [
							{
								title: "New sub sub child",
								link: "https://redmine.acme.dev/projects/my-project-name/wiki/New_sub_sub_child",
							},
							{
								title: "Sub sub sub child",
								link: "https://redmine.acme.dev/projects/my-project-name/wiki/Sub_sub_sub_child",
								children: [
									{
										title: "Aaa",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaa",
										children: [
											{
												title: "Hahayes",
												link: "https://redmine.acme.dev/projects/my-project-name/wiki/Hahayes",
												children: [
													{
														title: "I am so happy",
														link: "https://redmine.acme.dev/projects/my-project-name/wiki/I_am_so_happy",
													},
												],
											},
										],
									},
									{
										title: "Aaaaa",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaaaa",
									},
									{
										title: "Aaab",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaab",
									},
									{
										title: "Aaabcc",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Aaabcc",
									},
									{
										title: "Fdafasdas",
										link: "https://redmine.acme.dev/projects/my-project-name/wiki/Fdafasdas",
									},
								],
							},
						],
					},
				],
			},
			{
				title: "Wiki1-child2",
				link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki1-child2",
			},
		],
	},

	{
		title: "Wiki2",
		link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki2",
		children: [
			{
				title: "Wiki2-child1",
				link: "https://redmine.acme.dev/projects/my-project-name/wiki/Wiki2-child1",
			},
		],
	},
];
