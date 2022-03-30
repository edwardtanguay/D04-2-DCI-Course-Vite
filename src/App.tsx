import React from 'react';
import { AppProvider } from './context/AppContext';
import Site from './components/Site';
import * as config from './config';

function App() {
	return (
		<AppProvider>
			<div className='App'>
				<Site />
			</div>
		</AppProvider>
	);
}

export default App;
