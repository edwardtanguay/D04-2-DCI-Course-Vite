import { ISubmodule } from '../models/interfaces';
import { IoCheckmark } from 'react-icons/io5';

interface IProps {
	submodule: ISubmodule;
	toggleOverviewCollapse: any
}

export const Overview = (props: IProps) => {
	const { submodule, toggleOverviewCollapse } = props;
	return (
		<>
			{
				submodule.overview !== '' && (
					<div className="overviewCollapsed"><span onClick={() => toggleOverviewCollapse()}>1 Overview</span> <IoCheckmark /></div>
				)
			}
			{
				!submodule.overviewCollapsed && (
					<fieldset className="overview">
						<legend><span onClick={() => toggleOverviewCollapse()}>Read the Overview:</span></legend>
						<div>{submodule.overview} <input type="checkbox" /></div>
					</fieldset>
				)
			}
		</>
	)
}