import { SidebarApp } from "./extension/SidebarApp";
import { OptionsApp } from "./options";

function App() {
	return (
		<>
			<OptionsApp />
			{/* <div className="flex h-full dark">
				<div id="wrapper" className="flex">
					<div id="sidebar">
						<SidebarApp useSampleData />
					</div>
					<div id="main">
						<div className="p-16">
							<p>some content here</p>
						</div>
					</div>
				</div>
			</div> */}
		</>
	);
}

export default App;
