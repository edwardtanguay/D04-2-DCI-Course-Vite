import * as qstr from '../qtools/qstr';
import { ISubmodule } from '../models/interfaces';
import { IoCheckmark } from 'react-icons/io5';

interface IProps {
	submodule: ISubmodule;
	toggleObjectivesCollapse: any
}

export const Objectives = (props: IProps) => {
	const { submodule, toggleObjectivesCollapse } = props;
	return (
		<>
			{submodule.objectives.length > 0 && (
				<>
					{submodule.objectivesCollapsed && (
						<div className="objectivesCollapsed"><span onClick={() => toggleObjectivesCollapse()}>{qstr.smartPlural(submodule.objectives.length, 'Objective')}</span> <IoCheckmark /></div>
					)}
					{!submodule.objectivesCollapsed && (
						<fieldset className="objectives">
							<legend><span onClick={() => toggleObjectivesCollapse()}>Read these {qstr.smartPlural(submodule.objectives.length, 'Objective')}:</span></legend>
							<ul>
								{submodule.objectives.map((objective, index) => {
									return (
										<li><span key={index} dangerouslySetInnerHTML={{ __html: objective }}/> <input type="checkbox"/></li>
									)
								})}
							</ul>
						</fieldset>
					)}
				</>
			)}
		</>
	)
}