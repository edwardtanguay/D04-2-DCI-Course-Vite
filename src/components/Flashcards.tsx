import { useContext } from 'react';
import AppContext from '../context/AppContext';
import * as qstr from '../qtools/qstr';
import { IModule, ISubmodule, IFlashcard } from '../models/interfaces';
import { IoCheckmark } from 'react-icons/io5';

interface IProps {
	module: IModule;
	submodule: ISubmodule;
	toggleFlashcardsCollapse: any;
	toggleFlashcard: any;
	buildMoreInfos: any;
	setSubmodule: any;
}

export const Flashcards = (props: IProps) => {
	const { module, submodule, toggleFlashcardsCollapse, toggleFlashcard, buildMoreInfos, setSubmodule } = props;
	const modKey = module.abbreviation;
	const subKey = submodule.abbreviation;
	const { ASM } = useContext(AppContext);

	const flashcardsInfo = ASM.getFlashcardsInfoForSubmodule(modKey, subKey);

	const handleKnowThisClick = (e: any, flashcard: IFlashcard) => {
		e.stopPropagation();
		ASM.toggleFlashcardMarked(modKey, subKey, flashcard);
	};

	const displayOutlineText = (e: any, flashcard: IFlashcard): void => {
		if (e.altKey) {
			flashcard.outlineTextShowing = !flashcard.outlineTextShowing;
			setSubmodule({ ...submodule });
		}
	}

	return (
		<>
			{submodule.flashcards.length > 0 && (
				<>
					{submodule.flashcardsCollapsed && (
						<div className="flashcardsCollapsed"><span className="pill" onClick={() => toggleFlashcardsCollapse()}>{qstr.smartPlural(submodule.flashcards.length, 'Question')}</span>
							{flashcardsInfo.unmarked > 0 && (<span className="informAmount"><span>{flashcardsInfo.unmarked} more</span></span>)}
							{flashcardsInfo.unmarked === 0 && (<span> <IoCheckmark /></span>)}

						</div>
					)}
					{!submodule.flashcardsCollapsed && (
						<fieldset className="flashcards">
							<legend><span onClick={() => toggleFlashcardsCollapse()}>Mark the questions you are able to answer (currently {ASM.getNumberOfMarkedFlashcards(modKey, subKey)} of {submodule.flashcards.length}):</span></legend>
							<div className="flashcardGroup">
								{submodule.flashcards.map((flashcard, index) => {
									return (
										<div className="flashcardItem" key={index}>
											<div className="front" onClick={(() => toggleFlashcard(flashcard))}>
												<div className="header">
													<div className="tags">
														{flashcard.tagsArray.includes('assessment') && (
															<div className="assessmentTag">Know for the assessment:</div>
														)}
														{flashcard.tagsArray.length === 0 && (
															<div className="label">Question:</div>
														)}
													</div>
													{!flashcard.showBack && (
														<div className="knowThisMessage"><input onClick={e => handleKnowThisClick(e, flashcard)} type="checkbox" defaultChecked={ASM.flashcardIsMarked(modKey, subKey, flashcard)} /></div>
													)}
												</div>
												<div dangerouslySetInnerHTML={{ __html: flashcard.front }}></div>
											</div>
											{flashcard.showBack && (
												<>
													<div className={`back ${flashcard.moreInfos.length > 0 ? 'withMoreInfos' : 'withoutMoreInfos'}`} key={index} onClick={e => displayOutlineText(e, flashcard)}>
														{flashcard.outlineTextShowing && (
															<div className="outlineText">
																<textarea defaultValue={flashcard.outlineText} spellCheck="false"></textarea>
																<div className="escapeLink"><a target="_blank" href="https://appdevtools.com/json-escape-unescape" rel="noreferrer">escape text</a></div>
															</div>
														)}
														<div dangerouslySetInnerHTML={{ __html: flashcard.backHtml }}></div>
													</div>
												</>
											)}
											{flashcard.showBack && flashcard.moreInfos.length > 0 && (
												<div className="moreInfos" dangerouslySetInnerHTML={{ __html: buildMoreInfos(flashcard.moreInfos) }}></div>
											)}
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