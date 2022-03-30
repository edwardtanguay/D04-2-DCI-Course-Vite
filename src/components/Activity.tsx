/* eslint-disable jsx-a11y/alt-text */
import '../styles/schedule.scss';
import { ActivityCurriculumStatus, ICurriculum, IActivity } from '../models/interfaces';
import { useState } from 'react';

const githubLivecodingPath = 'https://github.com/FbW-D01/FbW-D01-Course/tree/main/_LIVECODINGS/';

interface IExplanationProps {
	curriculum: ICurriculum;
	initialActivity: IActivity;
}

function Activity(props: IExplanationProps) {
	const { curriculum, initialActivity } = props;
	const [activity, setActivity] = useState<IActivity>(initialActivity);

	const displayOutlineConversionText = (): void => {
		activity.outlineCopyTextShowing = !activity.outlineCopyTextShowing;
		setActivity({ ...activity });
	}

	return (
		<>
			{(!activity.cancelled || curriculum.adminAccess) && (
				<div className="activity">
					{/* EXTRA-CREDIT */}
					{activity.kind === 'extraCredit' && (
						<>
							<div className="screenshotArea">
								<img className="screenshot" src={activity.imagePathAndFileName} />
							</div>
							<div className="dataArea">
								<h4 className="activityKind">Extra Credit: <span className="title">{activity.title}</span></h4>
								<section className="topics">
									<ul>
										{activity.topics.map((topic, index) => {
											return (
												<>
													<li key={index}><a target="_blank" href={topic.url} rel="noreferrer">{topic.title}</a>
														{topic.notes.length > 0 && (
															<ul className="topicNotes">
																{topic.notes.map((note, index) => {
																	return (
																		<li key={index}>{note}</li>
																	)
																})}
															</ul>
														)}
													</li>
												</>
											)
										})}
									</ul>
								</section>
							</div>
						</>
					)}
					{/* LIVE-CODING */}
					{activity.kind === 'liveCoding' && (
						<>
							<div className="screenshotArea">
								<img className="screenshot" src={activity.imagePathAndFileName} onDoubleClick={() => displayOutlineConversionText()} />
								{activity.preliveCode !== '' && (
									<div className="codeLink"><a target="_blank" href={`${githubLivecodingPath}${activity.preliveCode}`} rel="noreferrer">Source Code</a></div>
								)}
							</div>
							<div className="dataArea">
								<h4 className="activityKind">Live Coding: <span className="title">{activity.title}</span></h4>
								{activity.outlineCopyTextShowing && (
									<>
										<textarea className="outlineCopyText" readOnly value={activity.outlineCopyText}></textarea>
										<div className="escapeLink"><a target="_blank" href="https://www.freeformatter.com/json-escape.html#ad-output" rel="noreferrer">escape text</a></div>
									</>
								)}
								{activity.outlineHtml !== '' && (
									<>
										<div className="outline" dangerouslySetInnerHTML={{ __html: activity.outlineHtml }}></div>
									</>
								)}
								<section className="topics">
									<ul>
										{activity.topics.map((topic, index) => {
											return (
												<>
													<li key={index}><a target="_blank" href={topic.url} rel="noreferrer"><span dangerouslySetInnerHTML={{ __html: topic.title }}></span></a>
														{topic.notes.length > 0 && (
															<ul className="topicNotes">
																{topic.notes.map((note, index) => {
																	return (
																		<li key={index}>{note}</li>
																	)
																})}
															</ul>
														)}
													</li>
												</>
											)
										})}
									</ul>
								</section>
							</div>
						</>
					)}
					{activity.kind === 'realLifeCodeAnalysis' && (
						<>
							<div className="screenshotArea">
								<img className="screenshot" src={activity.imagePathAndFileName} onDoubleClick={() => displayOutlineConversionText()} />
								{activity.preliveCode !== '' && (
									<div className="codeLink"><a target="_blank" href={`${githubLivecodingPath}${activity.preliveCode}`} rel="noreferrer">Source Code</a></div>
								)}
							</div>
							<div className="dataArea">
								<h4 className="activityKind">Real-Life Code Analysis: <span className="title">{activity.title}</span></h4>
								{activity.outlineCopyTextShowing && (
									<>
										<textarea className="outlineCopyText" readOnly value={activity.outlineCopyText}></textarea>
										<div>{activity.imagePathAndFileName}</div>
										<div className="escapeLink"><a target="_blank" href="https://www.freeformatter.com/json-escape.html#ad-output" rel="noreferrer">escape text</a></div>
									</>
								)}
								{activity.outlineHtml !== '' && (
									<>
										<div className="outline" dangerouslySetInnerHTML={{ __html: activity.outlineHtml }}></div>
									</>
								)}
								<section className="topics">
									<ul>
										{activity.topics.map((topic, index) => {
											return (
												<>
													<li key={index}><a target="_blank" href={topic.url} rel="noreferrer"><span dangerouslySetInnerHTML={{ __html: topic.title }}></span></a>
														{topic.notes.length > 0 && (
															<ul className="topicNotes">
																{topic.notes.map((note, index) => {
																	return (
																		<li key={index}>{note}</li>
																	)
																})}
															</ul>
														)}
													</li>
												</>
											)
										})}
									</ul>
								</section>
							</div>
						</>
					)}
					{/* ASSESSMENT */}
					{activity.kind === 'assessment' && (
						<>
							<div className="screenshotArea">
								<img className="screenshot" src={activity.imagePathAndFileName} onDoubleClick={() => displayOutlineConversionText()} />
							</div>
							<div className="dataArea">
								<h4 className="activityKind">{activity.displayKind}: <span className="title">{activity.title}</span></h4>
								{activity.outlineCopyTextShowing && (
									<>
										<textarea className="outlineCopyText" readOnly value={activity.outlineCopyText}></textarea>
										<div className="escapeLink"><a target="_blank" href="https://www.freeformatter.com/json-escape.html#ad-output" rel="noreferrer">escape text</a></div>
									</>
								)}
								{activity.outlineHtml !== '' && (
									<>
										<div className="outline" dangerouslySetInnerHTML={{ __html: activity.outlineHtml }}></div>
									</>
								)}
								{activity.topics.length > 0 && (
									<section className="topics">
										<ul>
											{activity.topics.map((topic, index) => {
												return (
													<>
														<li key={index}><a target="_blank" href={topic.url} rel="noreferrer"><span dangerouslySetInnerHTML={{ __html: topic.title }}></span></a>
															{topic.notes.length > 0 && (
																<ul className="topicNotes">
																	{topic.notes.map((note, index) => {
																		return (
																			<li key={index}>{note}</li>
																		)
																	})}
																</ul>
															)}
														</li>
													</>
												)
											})}
										</ul>
									</section>
								)}
							</div>
						</>
					)}
					{/* EXPLANATION */}
					{activity.kind === 'explanation' && (
						<>
							<div className="screenshotArea">
								<img className="screenshot" src={activity.imagePathAndFileName} onDoubleClick={() => displayOutlineConversionText()} />
							</div>
							<div className="dataArea">
								<h4 className="activityKind">{activity.displayKind}: <span className="title">{activity.title}</span></h4>
								{activity.outlineCopyTextShowing && (
									<>
										<textarea className="outlineCopyText" readOnly value={activity.outlineCopyText}></textarea>
										<div className="escapeLink"><a target="_blank" href="https://www.freeformatter.com/json-escape.html#ad-output" rel="noreferrer">escape text</a></div>
									</>
								)}
								{activity.outlineHtml !== '' && (
									<>
										<div className="outline" dangerouslySetInnerHTML={{ __html: activity.outlineHtml }}></div>
									</>
								)}
								{activity.topics.length > 0 && (
									<section className="topics">
										<ul>
											{activity.topics.map((topic, index) => {
												return (
													<>
														<li key={index}><a target="_blank" href={topic.url} rel="noreferrer"><span dangerouslySetInnerHTML={{ __html: topic.title }}></span></a>
															{topic.notes.length > 0 && (
																<ul className="topicNotes">
																	{topic.notes.map((note, index) => {
																		return (
																			<li key={index}>{note}</li>
																		)
																	})}
																</ul>
															)}
														</li>
													</>
												)
											})}
										</ul>
									</section>
								)}
							</div>
						</>
					)}
					{/* ACTIVITY */}
					{activity.kind === 'activity' && (
						<>
							<div className="screenshotArea">
								<img className="screenshot" src={activity.imagePathAndFileName} onDoubleClick={() => displayOutlineConversionText()} />
							</div>
							<div className="dataArea">
								<h4 className="activityKind">{activity.displayKind}: <span className="title">{activity.title}</span></h4>
								{activity.outlineCopyTextShowing && (
									<>
										<textarea className="outlineCopyText" readOnly value={activity.outlineCopyText}></textarea>
										<div className="escapeLink"><a target="_blank" href="https://www.freeformatter.com/json-escape.html#ad-output" rel="noreferrer">escape text</a></div>
									</>
								)}
								{activity.outlineHtml !== '' && (
									<>
										<div className="outline" dangerouslySetInnerHTML={{ __html: activity.outlineHtml }}></div>
									</>
								)}
								{activity.topics.length > 0 && (
									<section className="topics">
										<ul>
											{activity.topics.map((topic, index) => {
												return (
													<>
														<li key={index}><a target="_blank" href={topic.url} rel="noreferrer"><span dangerouslySetInnerHTML={{ __html: topic.title }}></span></a>
															{topic.notes.length > 0 && (
																<ul className="topicNotes">
																	{topic.notes.map((note, index) => {
																		return (
																			<li key={index}>{note}</li>
																		)
																	})}
																</ul>
															)}
														</li>
													</>
												)
											})}
										</ul>
									</section>
								)}
							</div>
						</>
					)}
					{/* EXERCISE */}
					{((activity.kind === 'exercise' && !activity.cancelled) || (activity.cancelled && curriculum.adminAccess)) && (
						<>
							{/* [{activity.curriculumStatus}] */}
							<div className="screenshotArea">
								<img className="screenshot" src={activity.imagePathAndFileName} />
								<div className="cancelledReason">{activity.cancelledReason}</div>
							</div>
							<div className={`dataArea${activity.cancelled ? ' cancelled' : ''}`}>
								<h4 className="activityKindExercise">{activity.displayKind} {activity.exerciseSymbol}{activity.exerciseNumber}
									:
									<span className="title"> {activity.title}</span>
									{activity.rank > 0 && (
										<>
											<span className="theRank"><span className="title">&nbsp;- </span>{activity.rank.toFixed(1)}</span>
										</>
									)}
								</h4>
								<div className="description">{activity.description}</div>
								{(activity.adminMessage !== '' && curriculum.adminAccess) && (
									<div className="adminMessage">{activity.adminMessage}</div>
								)}
								{activity.curriculumStatus === ActivityCurriculumStatus.raw && curriculum.adminAccess && !activity.cancelled && (
									<>
										<div className="exerciseCodeArea"><input type="text" value={activity.exerciseCode} />&nbsp;&nbsp;-&nbsp;<a target="_blank" href={activity.createExerciseUrl} rel="noreferrer">create exercise repository</a></div>
										<div className="readmeTitle">README.md</div>
										<textarea className="readmeCopyText" readOnly value={activity.readmeCopyText}></textarea>
									</>
								)}
								{(activity.curriculumStatus === ActivityCurriculumStatus.released || curriculum.adminAccess) && (
									<a target="_blank" className="activityUrl" href={activity.url} rel="noreferrer">{activity.url}</a>
								)}

								{/* {activity.curriculumStatus === ActivityCurriculumStatus.released && (
									<div className="statusArea">
										<div className="finished">{activity.status.numberFinished} Finished: {activity.status.finished}</div>
										<div className="unfinished">{activity.status.numberUnfinished} Unfinished: {activity.status.unfinished}</div>
									</div>
								)} */}

								{activity.dciExerciseUrl !== '' && curriculum.adminAccess && (
									<>
										<div className="time">{activity.time}</div>
										{activity.rawTopics !== '' && (
											<section className="rawTopics">
												<div dangerouslySetInnerHTML={{ __html: activity.rawTopics }}></div>
											</section>
										)}

										<fieldset className="dciLinkArea">
											<legend>Requires Teacher Access</legend>
											<ul>
												<li>DCI Link to exercise: <a target="_blank" href={activity.dciExerciseUrl} rel="noreferrer">{activity.dciExerciseUrl}</a></li>
												<li>DCI Link to solution: <a target="_blank" href={activity.dciSolutionUrl} rel="noreferrer">{activity.dciSolutionUrl}</a></li>
											</ul>
										</fieldset>
									</>
								)}

								<section className="topics">
									<ul>
										{activity.topics.map((topic, index) => {
											return (
												<>
													<li key={index}><a target="_blank" href={topic.url} rel="noreferrer">{topic.title}</a>
														{topic.notes.length > 0 && (
															<ul className="topicNotes">
																{topic.notes.map((note, index) => {
																	return (
																		<li key={index}>{note}</li>
																	)
																})}
															</ul>
														)}
													</li>
												</>
											)
										})}
									</ul>
								</section>
							</div>
						</>
					)}
				</div>
			)}
		</>
	)
}

export default Activity;