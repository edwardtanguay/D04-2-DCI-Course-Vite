/* eslint-disable jsx-a11y/alt-text */
import '../styles/schedule.scss';
import { IDay, } from '../models/interfaces';
import initialCurriculum from '../models/model_curriculum';
import { curriculumDays } from '../models/model_curriculum';
import Module from './Module';
import { useState, useEffect } from 'react';

function PageSchedule() {
	const [curriculum, setCurriculum] = useState(initialCurriculum);
	const [adminLabel, setAdminLabel] = useState('');
	const [classBookEntryDay, setClassBookEntryDay] = useState<IDay | undefined>(curriculumDays[0]);

	useEffect(() => {
		setClassBookEntryDay(curriculumDays[curriculumDays.length - 1]);
	}, []);

	const toggleAdminAccess = () => {
		curriculum.adminAccess = !curriculum.adminAccess;
		setCurriculum({ ...curriculum });
		adminLabel !== 'admin' ? setAdminLabel('admin') : setAdminLabel('');
	}

	const changeClassBookEntryDate = (date: string) => {
		setClassBookEntryDay(curriculumDays.find(m => m.date === date));
	}

	const getSafeObjectPropertyValue = (obj: any, func:Function ): string => {
		return obj === undefined ? '' : func(obj);
	}

	return (
		<>
			<div className="page page_schedule">
				<div>
			<strong>Goal: you started a fun, challenging, well-paid developer job in November</strong>	
				</div>	
						<hr />
				<div className="commandPanel" onClick={() => toggleAdminAccess()} dangerouslySetInnerHTML={{ __html: adminLabel }}></div>
				{curriculum.modules.map((module, index) => {
					return (
						<Module key={index} module={module} curriculum={curriculum} />
					)
				})}
				{curriculum.adminAccess && (
					<div className="adminPanel">
						<h1>Admin Panel</h1>
						<div className="adminContainer">
							<h2>Daily Class Book Entries:
								<select className="classBookEntryDate" value={getSafeObjectPropertyValue(classBookEntryDay, (m:IDay) => m.date)} onChange={(e) => changeClassBookEntryDate(e.target.value)}>
									{curriculumDays.map((day, index) => {
										return (
											<option value={day.date} key={index} >{getSafeObjectPropertyValue(day, (m: IDay) => `${m.date} ${m.submoduleAbbreviation}: ${m.title}`)}</option>
										)
									})}
								</select>
								<textarea className="classBookCopyText" readOnly value={getSafeObjectPropertyValue(classBookEntryDay, (m:IDay)=> m.courseBookCopyText)}></textarea>
							</h2>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default PageSchedule;