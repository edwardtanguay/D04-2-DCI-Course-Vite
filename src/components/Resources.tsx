import * as qstr from '../qtools/qstr';
import { ISubmodule } from '../models/interfaces';

interface IProps {
	submodule: ISubmodule;
	toggleResourcesCollapse: any
}

export const Resources = (props: IProps) => {
	const { submodule, toggleResourcesCollapse } = props;
	return (
		<>
			{submodule.resources.length > 0 && (
				<>
					{submodule.resourcesCollapsed && (
						<div className="resourcesCollapsed"><span onClick={() => toggleResourcesCollapse()}>{qstr.smartPlural(submodule.resources.length, 'Resource')}</span></div>
					)}
					{!submodule.resourcesCollapsed && (
						<fieldset className="resources">
							<legend><span onClick={() => toggleResourcesCollapse()}>{qstr.smartPlural(submodule.resources.length, 'Resource')}</span></legend>
							<div className="resourceListArea">
								{submodule.resources.map((resource, index) => {
									return (
										<div className="singleResourceArea">
											<div className="iconLinkRow">
												<div>
													<div><img src={`images/resourceTypeIcons/${resource.iconFileName}`} alt="" /></div>
													<div className="time">{resource.time}</div>
												</div>
												<div>
													<a href={resource.url} target="_blank" rel="noreferrer"><span key={index} dangerouslySetInnerHTML={{ __html: resource.title }}></span></a>
													<ul className="resourceNotes">
														{resource.notes.map(note => {
															return (
																<li className="note" dangerouslySetInnerHTML={{ __html: note }}></li>
															)
														})}
													</ul>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</fieldset>
					)}
				</>
			)}
		</>
	)
}