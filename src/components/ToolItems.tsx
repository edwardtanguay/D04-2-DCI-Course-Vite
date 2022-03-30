import { IModule, ISubmodule, IToolItem } from '../models/interfaces';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import * as qstr from '../qtools/qstr';
import { IoCheckmark } from 'react-icons/io5';

interface IProps {
	module: IModule;
	submodule: ISubmodule;
	toggleToolItemsCollapse: any
	toggleToolItem: any;
	setSubmodule: any;
}

export const ToolItems = (props: IProps) => {
	const { module, submodule, toggleToolItemsCollapse, toggleToolItem, setSubmodule } = props;
	const modKey = module.abbreviation;
	const subKey = submodule.abbreviation;
	const { ASM } = useContext(AppContext);

	const toolItemsInfo = ASM.getToolItemsInfoForSubmodule(modKey, subKey);

	const handleKnowThisClick = (e: any, toolItem: IToolItem) => {
		e.stopPropagation();
		ASM.toggleToolItemMarked(modKey, subKey, toolItem);
	};

	const displayOutlineText = (e: any, toolItem: IToolItem): void => {
		if (e.altKey) {
			toolItem.outlineTextShowing = !toolItem.outlineTextShowing;
			setSubmodule({ ...submodule });
		}
	}

	return (
		<>
			{submodule.toolItems.length > 0 && (
				<>
					{submodule.toolItemsCollapsed && (
						<div className="toolItemsCollapsed"><span className="pill" onClick={() => toggleToolItemsCollapse()}>{qstr.smartPlural(submodule.toolItems.length, 'Learn Item')}</span><span className="informAmount"> {toolItemsInfo.unmarked} more</span></div>
					)}
					{!submodule.toolItemsCollapsed && (
						<fieldset className="toolItems">
							<legend><span onClick={() => toggleToolItemsCollapse()}>Mark the items you understand (currently {ASM.getNumberOfMarkedToolItems(modKey, subKey)} of {submodule.toolItems.length}):</span></legend>
							<ul className="toolItemGroup">
								{submodule.toolItems.map((toolItem, index) => {
									return (
										<div className="toolItem" key={index}>
											<div className="front" onClick={(() => toggleToolItem(toolItem))}>
												<div className="header">
													<div className="label"><span className="title"><span dangerouslySetInnerHTML={{ __html: toolItem.title }}></span></span><span className="kind"> - {toolItem.kind}</span> <span className="stars"> - ({toolItem.rankHtml})</span></div>
													{!toolItem.showNotes && (
														<div className="knowThisMessage"><input onClick={e => handleKnowThisClick(e, toolItem)} type="checkbox" defaultChecked={ASM.toolItemIsMarked(modKey, subKey, toolItem)} /></div>
													)}
												</div>
												
											</div>
											{toolItem.showNotes && (
												<>
													<div className={`notes`} key={index} onClick={e => displayOutlineText(e, toolItem)}>
														{toolItem.outlineTextShowing && (
															<div className="outlineText">
																<textarea defaultValue={toolItem.outlineText} spellCheck="false"></textarea>
																<div className="escapeLink"><a target="_blank" href="https://appdevtools.com/json-escape-unescape" rel="noreferrer">escape text</a></div>
															</div>
														)}
														<div dangerouslySetInnerHTML={{ __html: toolItem.notesHtml }}></div>
													</div>
												</>
											)}
										</div>
									)
								})}
							</ul>
						</fieldset>
					)}
				</>
			)
			}
		</>
	)
}