/* eslint-disable jsx-a11y/alt-text */
import '../styles/schedule.scss';
import { ICurriculum, IModule } from '../models/interfaces';
import Submodule from './Submodule';


interface IModuleProps {
	module: IModule;
	curriculum: ICurriculum;
}

function Module(props: IModuleProps) {
	const { module, curriculum } = props;
	return (
		<>
			<h1>{module.title} ({module.abbreviation})</h1>
			{module.submodules.map((submodule, index) => {
				return (
					<Submodule key={index} module={module} initialSubmodule={submodule} curriculum={curriculum}/>
				)
			})}
		</>
	)
}

export default Module;