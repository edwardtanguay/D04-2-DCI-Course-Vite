/* eslint-disable jsx-a11y/alt-text */
import '../styles/schedule.scss';
import { MdOndemandVideo } from 'react-icons/md';
import { ICurriculum, IDay } from '../models/interfaces';
import Activity from './Activity';
import { useState } from 'react';
import * as qdat from '../qtools/qdat';

interface IDayProps {
	initialDay: IDay;
	curriculum: ICurriculum;
}

function Day(props: IDayProps) {
	const { initialDay, curriculum } = props;
	const [day, setDay] = useState(initialDay);

	const toggleDayCollapse = () => {
		day.collapsed = !day.collapsed;
		setDay({ ...day });
	}
	return (
		<>
			<section className={`day ${day.timeStatus} ${day.kind}`}>
				<h3 onClick={() => toggleDayCollapse()}>
					{qdat.getShortAmericanDateWithDay(day.date)} <span className="dayTitle">{day.title}</span>
					<span className="exerciseStatusItems">{day.exerciseStatusItems.map((ei,index) => {
						return (
							<span key={index} className="exerciseStatusItem"><span className="exerciseNumber">EX{ei.exerciseNumber}</span>
								{!(ei.numberFinished === 0 && ei.numberUnfinished === 0) && (
									<sup className="numberGroup"><span className="finished">{ei.numberFinished}</span><span className="slash"> / </span><span className="unfinished">{ei.numberUnfinished}</span></sup>
								)}
							</span>
						)
					})}
						{day.timeStatus === 'today' && (
							<>
								<span className="todayLabel">today</span>
							</>
						)}
					</span>
					<span className="videoPreview">{day.videos.map(video => {
						return (
							<span><MdOndemandVideo className="videoIcon" /></span>
						)
					})}</span>
				</h3>
				{!day.collapsed && (
					<>
						{curriculum.adminAccess && day.bulkTopics !== '' && (
							<section className="bulkTopics">
								<div dangerouslySetInnerHTML={{ __html: day.bulkTopics }}></div>
							</section>
						)}

						{day.videos.map((video, index) => {
							return (
								<div key={index} className="videoArea">
									<a href={video.url} target="_blank" rel="noreferrer"><MdOndemandVideo className="videoIcon" /></a>
									<div>
										<a href={video.url} target="_blank" rel="noreferrer"><div className="videoDescription">VIDEO: {video.description}</div></a>
										<div className="videoExtra">{video.extra}</div>
									</div>
								</div>
							)
						})}
						<section className="activities">
							{day.activities.map((activity, index) => {
								return (
									<div key={index}>
										<Activity curriculum={curriculum} initialActivity={activity} />
									</div>
								)
							})}
						</section>
					</>
				)}
			</section>
		</>
	)
}

export default Day;

