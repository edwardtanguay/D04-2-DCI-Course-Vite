import * as qstr from '../qtools/qstr';
import { ISubmodule } from '../models/interfaces';

interface IProps {
	submodule: ISubmodule;
	toggleTaskItemsCollapse: any
}

export const TaskItems = (props: IProps) => {
	const { submodule, toggleTaskItemsCollapse } = props;
	return (
		<>
			{submodule.taskItems.length > 0 && (
				<>
					{submodule.taskItemsCollapsed && (
						<div className="taskItemsCollapsed"><span className="pill" onClick={() => toggleTaskItemsCollapse()}>{qstr.smartPlural(submodule.taskItems.length, 'Task')}</span><span className="informAmount"> 8 more</span></div>
					)}
					{!submodule.taskItemsCollapsed && (
						<fieldset className="taskItems">
							<legend><span onClick={() => toggleTaskItemsCollapse()}>Mark the tasks you are able to solve (currently 5 of {submodule.taskItems.length}):</span></legend>
							<ul className="taskItemGroup">
								{submodule.taskItems.map((taskItem, index) => {
									return (
										<li className="title" key={index} dangerouslySetInnerHTML={{ __html: taskItem.title }}></li>
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